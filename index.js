'use-strict';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import rfs from 'rotating-file-stream';
import allRoutes from "./src/routes/index.js";


await setupEnvVars();
const { NODE_ENV, DB_URI, LISTENING_PORT, LOG_ENABLED, LOG_PATH, LOG_FILE } = process.env;

console.log(`[SERVER] Runs in env : ${ NODE_ENV }`);

const app = express();

mongoose.connect(DB_URI, {
		useCreateIndex: true,
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	// TODO: hide login from the URI before log it
	.then(() => {
		console.log(`[SERVER] Mongoose connected to server using URI “${ DB_URI }”`);
	})
	.catch(( err ) => {
		console.log(`[SEVER] Mongoose as encounter an error`);
		console.log(err);
	});

if ( NODE_ENV === "development" ) {
	app.use(morgan('[REQ] :method :url :status ~ :total-time ms'));
} else {
	if ( LOG_ENABLED ) {
		const morganLogFormat = '[:date[clf]] from=:remote-addr → ' +
			':status :method :url ~ “:user-agent” ~ HTTP/:http-version | :total-time ms';

		const streamFilenameOperator = ( time, index ) => {
			const fileIndex = index || 0;

			const currentTime = new Date(); // Return today's date and time
			const month = currentTime.getMonth() + 1; // returns the month (from 0 to 11)
			const day = currentTime.getDate(); // returns the day of the month (from 1 to 31)
			const year = currentTime.getFullYear(); // returns the year (four digits)

			return `${ year }-${ month }-${ day }_n${ fileIndex }_${ LOG_FILE }`;
		};

		const errorsFileStream = rfs.createStream(streamFilenameOperator, {
			interval: '1d', // rotate daily
			size: "10M", // rotate if logs file size superior of 10M
			// compress: true, // TODO: add a cron to compress old logs evry days
			path: LOG_PATH + '/errors/',
		});

		app.use(morgan(
			morganLogFormat, {
				skip: function ( req, res ) {
					return res.statusCode < 400
				},
				stream: errorsFileStream
			}));

		console.log(`[SERVER] Logging enabled !`);
		console.log(`[SERVER] Errors will logging in ${ LOG_PATH }/errors/`);

		if ( process.env.LOG_ALL ) {
			const successFileStream = rfs.createStream(streamFilenameOperator, {
				interval: '1d', // rotate daily
				size: "10M", // rotate if logs file size superior of 10M
				// compress: true, // TODO: add a cron to compress old logs evry days
				path: LOG_PATH + '/success/',
			});

			app.use(morgan(
				morganLogFormat, {
					skip: function ( req, res ) {
						return res.statusCode >= 400
					},
					stream: successFileStream
				}));

			console.log(`[SERVER] Success requests will logging in ${ LOG_PATH }/success/`);
		} else console.log(`[SERVER] Only errors are logged, because the environment variable LOG_ALL is not true.`)
	} else console.log(`[CONFIG] Logging disabled ! Set “LOG_ENABLED” to true in environment to enable it.`)
}

app.use(express.json());
app.use(express.static('public')); // Allows the API to serve static files in the public folder.

app.listen(LISTENING_PORT, () => {
	console.log(`[SERVER] Listening port : ${ LISTENING_PORT }`);
});

allRoutes(app);
