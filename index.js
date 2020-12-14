'use-strict';
import express from 'express';
import mongoose from 'mongoose';
import { createRequire } from 'module';
import { normalizeNodeEnv } from "./src/helpers/services/nodeEnvService.js";
import allRoutes from "./src/routes/index.js";

if ( process.env.NODE_ENV === undefined ) {
	const require = createRequire(import.meta.url);
	require('dotenv').config();
	console.log(`[SERVER] dotenv of module imports`)
}

normalizeNodeEnv();

const { NODE_ENV, DB_URI, LISTENING_PORT } = process.env;

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

app.use(express.json());
app.use(express.static('public')); // Allows the API to serve static files in the public folder.

app.listen(LISTENING_PORT, () => {
	console.log(`[SERVER] Listening port : ${ LISTENING_PORT }`);
});

allRoutes(app);
