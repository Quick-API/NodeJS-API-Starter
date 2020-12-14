'use-strict';

export function normalizeNodeEnv() {
	if ( process.env.NODE_ENV.toString().toUpperCase() === "DEV" )
		process.env.NODE_ENV = "development";
	else if ( process.env.NODE_ENV.toString().toUpperCase() === "PROD" )
		process.env.NODE_ENV = "production";
	else if ( process.env.NODE_ENV === undefined || process.env.NODE_ENV === null )
		process.env.NODE_ENV = "development";
}
