'use-strict';
import { createRequire } from "module";
import { conditionalLog } from "./conditionnalPrint.js";
import request from "./request.js";


function normalizeNodeEnv() {
	if ( process.env.NODE_ENV.toString().toUpperCase() === "DEV" )
		process.env.NODE_ENV = "development";
	else if ( process.env.NODE_ENV.toString().toUpperCase() === "PROD" )
		process.env.NODE_ENV = "production";
	else if ( process.env.NODE_ENV.toString().toUpperCase() === "TEST" ||
		process.env.NODE_ENV.toString().toUpperCase() === "TESTING" )
		process.env.NODE_ENV = "testing";
	else if ( process.env.NODE_ENV === undefined || process.env.NODE_ENV === null )
		process.env.NODE_ENV = "production";
	else
		process.env.NODE_ENV = process.env.NODE_ENV.toString().toLowerCase();
}

export async function setupEnvVars( printInfos = true ) {
	conditionalLog( !isTestingEnvironment, `\n\n---- SERVER START ----`);

	if ( process.env.DB_URI === undefined ) {
		const require = createRequire(import.meta.url);
		require('dotenv').config();
		conditionalLog( !isTestingEnvironment,
			`[CONFIG] Setup dotenv modules`);
	}

	if ( process.env.NODE_ENV ) normalizeNodeEnv();
	else {
		conditionalLog( !isTestingEnvironment,
			`[CONFIG] Environment variable “NODE_ENV“ isn't setup => using default value.`);
		process.env.NODE_ENV = "production";
	}

	if ( !process.env.API_ENDPOINT ) {
		conditionalLog( !isTestingEnvironment,
			`[CONFIG] Environment variable “API_ENDPOINT“ isn't setup => using default value.`);
		process.env.API_ENDPOINT = '/api';
	}

	if ( process.env.NODE_ENV === 'testing' )
		if ( !process.env.DB_URI__TESTS ) {
			conditionalLog(true,
				`[CONFIG] Environment variable “DB_URI__TESTS“ is missing !`);
			process.exit(1);
		} else process.env.DB_URI = process.env.DB_URI__TESTS;
	else if ( !process.env.DB_URI ) {
		conditionalLog(true,
			`[CONFIG] Environment variable “DB_URI“ is missing !`);
		process.exit(1);
	}

	if ( !process.env.LISTENING_PORT ) {
		conditionalLog( !isTestingEnvironment,
			`[CONFIG] Environment variable “LISTENING_PORT“ isn't setup => find open port.`);
		process.env.LISTENING_PORT = "4000";
	}

	if ( !process.env.LOG_ENABLED ) {
		conditionalLog( !isTestingEnvironment,
			`[CONFIG] Environment variable “LOG_ENABLED“ isn't setup => using default value.`);
		process.env.LOG_ENABLED = "true";
	}

	if ( !process.env.LOG_PATH ) {
		conditionalLog( !isTestingEnvironment,
			`[CONFIG] Environment variable “LOG_PATH“ isn't setup => using default value.`);
		process.env.LOG_FILE = 'logs.log';
		process.env.LOG_PATH = './logs';
	} else {
		process.env.LOG_FILE = process.env.LOG_PATH.split('/')[process.env.LOG_PATH.split('/').length - 1];
		process.env.LOG_PATH = process.env.LOG_PATH.replace(( '/' + LOG_FILE ), '');
	}

	if ( !process.env.TESTS_CLEAR_BD ) {
		conditionalLog( isTestingEnvironment,
			`[CONFIG] Environment variable “TESTS_CLEAR_BD“ isn't setup => using default value.`);
		process.env.TESTS_CLEAR_BD = "false";
	}

	if ( process.env.NODE_ENV === "development" || process.env.NODE_ENV === "testing" )
		process.env.VERBBOSE = "true";
}

export const isVerboseEnabled = process.env.VERBOSE === "true";
export const isTestingEnvironment = process.env.NODE_ENV === "testing";

export async function findOpenPort( entryPort ) {
	const port = parseInt(entryPort);

	if ( port >= 0 && port < 65536 ) {
		try {
			const result = await request.get('localhost', port);

			if ( result )
				return await findOpenPort(port + 1);
			else
				return port;
		} catch ( e ) {
			return port;
		}
	} else throw new Error('The API server listening port must be between 0 and 65536 !');
}
