'use-strict';

function normalizeNodeEnv() {
	if ( process.env.NODE_ENV.toString().toUpperCase() === "DEV" )
		process.env.NODE_ENV = "development";
	else if ( process.env.NODE_ENV.toString().toUpperCase() === "PROD" )
		process.env.NODE_ENV = "production";
	else if ( process.env.NODE_ENV === undefined || process.env.NODE_ENV === null )
		process.env.NODE_ENV = "development";
}

export function setupEnvVars() {
	if ( process.env.NODE_ENV ) normalizeNodeEnv();
	else {
		console.log(`[CONFIG] Environment variable “NODE_ENV“ isn't setup => using default value.`);
		process.env.NODE_ENV = "production";
	}

	if ( !process.env.API_ENDPOINT ) {
		console.log(`[CONFIG] Environment variable “API_ENDPOINT“ isn't setup => using default value.`);
		process.env.API_ENDPOINT = '/api';
	}

	if ( !process.env.DB_URI ) {
		console.log(`[CONFIG] Environment variable “DB_URI“ is missing !`);
		process.exit(1);
	}

	if ( !process.env.LISTENING_PORT ) {
		console.log(`[CONFIG] Environment variable “LISTENING_PORT“ isn't setup => using default value.`);
		process.env.LISTENING_PORT = 4000
	}

	if ( !process.env.LOG_ENABLED ) {
		console.log(`[CONFIG] Environment variable “LOG_ENABLED“ isn't setup => using default value.`);
		process.env.LOG_ENABLED = true;
	}

	if ( !process.env.LOG_PATH ) {
		console.log(`[CONFIG] Environment variable “LOG_PATH“ isn't setup => using default value.`);
		process.env.LOG_FILE = 'logs.log';
		process.env.LOG_PATH = './logs';
	} else {
		process.env.LOG_FILE = process.env.LOG_PATH.split('/')[process.env.LOG_PATH.split('/').length - 1];
		process.env.LOG_PATH = process.env.LOG_PATH.replace(( '/' + LOG_FILE ), '');
	}
}
