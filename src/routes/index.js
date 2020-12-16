'use-strict';
import exampleRoutes from "./exampleRoutes.js";

export default function allRoutes( app ) {
	const endpoint = process.env.API_ENDPOINT || '/api';

	app.get(`/`, ( req, res ) => {
		res.send(`Your API is on ${ endpoint }`);
	});

	app.get(`${ endpoint }/`, ( req, res ) => {
		res.send(`Welcome on your API 🥳`);
	});

	exampleRoutes(app, endpoint);
};
