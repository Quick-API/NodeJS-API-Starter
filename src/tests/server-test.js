'use-strict';
import test from "ava";
import request from '../helpers/services/request.js';

const hostname = `localhost`;
const port = process.env.LISTENING_PORT;
const basePath = '/';
const apiEndpoint = process.env.API_ENDPOINT;

test.serial('Server API is running', async t => {
	const getResult = await request.get(hostname, port, basePath);
	if ( getResult.statusCode === 200 ) {
		if ( getResult.data === 'Your API is on /api' )
			t.pass();
		else t.fail(`Expected default welcome message, [type ${ typeof getResult.data }] "${ getResult.data }" received.`);
	} else t.fail(`Expected 200 status code, [type ${ typeof getResult.statusCode }] "${ getResult.statusCode }" received.`);
});

test('API endpoint respond', async t => {
	const getResult = await request.get(hostname, port, apiEndpoint);
	if ( getResult.statusCode === 200 ) {
		if ( getResult.data === 'Welcome on your API 🥳' )
			t.pass();
		else t.fail(`Expected welcome message, [type ${ typeof getResult.data }] "${ getResult.data }" received.`);
	} else t.fail(`Expected 200 status code, [type ${ typeof getResult.statusCode }] "${ getResult.statusCode }" received.`);
});
