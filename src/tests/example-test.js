import mongoose from "mongoose";
import test from "ava";
import request from '../helpers/services/request.js';
import { isSuccessStatusCode } from "./helpers/statuscodeTestersService.js";

'use-strict';

const hostname = `localhost`;
const port = process.env.LISTENING_PORT;
const basePath = '/api/examples';

const newExampleData = {
	"firstname": "Firstname",
	"lastname": "Lastname",
};
let newExampleId;

// TODO: Find a good way to mock the database
// TODO: Scheduling tests

test.serial.before(t => {
	if ( process.env.TESTS_CLEAR_BD === "true" )
		for ( const collection in mongoose.connection.collections ) {
			mongoose.connection.collection(collection).drop();
		}
});

test.serial('[POST] create an example', async t => {
	const { data: dataRaw, statusCode } = await request.post(hostname, port, basePath, newExampleData);
	const data = JSON.parse(dataRaw);

	if ( !isSuccessStatusCode(statusCode) )
		t.fail(`StatusCode isn't a success. Given ${ statusCode }`);
	if ( statusCode !== 201 )
		t.fail(`StatusCode doesn't follow REST guidelines. Expected 201 given ${ statusCode }`);

	if ( !data.hasOwnProperty('firstname') )
		t.fail('Missing "firstname" property in result');
	if ( data.firstname !== newExampleData.firstname )
		t.fail(`Property "firstname" doesn't match with request`);

	if ( !data.hasOwnProperty('lastname') )
		t.fail('Missing "lastname" property in result');
	if ( data.lastname !== newExampleData.lastname )
		t.fail(`Property "lastname" doesn't match with request`);

	newExampleId = data._id;
});

test.serial('[GET] get all examples', async t => {
	const { data: dataRaw, statusCode } = await request.get(hostname, port, basePath);
	const data = JSON.parse(dataRaw);

	if ( !isSuccessStatusCode(statusCode) )
		t.fail(`StatusCode isn't a success. Given ${ statusCode }`);
	if ( statusCode !== 200 )
		t.fail(`StatusCode doesn't follow REST guidelines. Expected 200 given ${ statusCode }`);

	if ( Array.isArray(data) ) {
		data.forEach(example => {
			if ( !example.hasOwnProperty('firstname') )
				t.fail('Missing firstname property');
			if ( !example.hasOwnProperty('lastname') )
				t.fail('Missing lastname property');
		});
		t.pass();
	} else t.fail(`Expected array given ${ typeof data } : ${ data }`);
});

test.serial('[GET] get an examples by ID', async t => {
	const { data: dataRaw, statusCode } = await request.get(hostname, port, `${ basePath }/${ newExampleId }`);
	const data = JSON.parse(dataRaw);

	if ( !isSuccessStatusCode(statusCode) )
		t.fail(`StatusCode isn't a success. Given ${ statusCode }`);
	if ( statusCode !== 200 )
		t.fail(`StatusCode doesn't follow REST guidelines. Expected 200 given ${ statusCode }`);

	if ( typeof data !== 'object' )
		t.fail(`Expected array given ${ typeof data } : ${ data }`);

	if ( !data.hasOwnProperty('firstname') )
		t.fail('Missing "firstname" property in result');
	if ( data.firstname !== newExampleData.firstname )
		t.fail(`Property "firstname" doesn't match with request`);

	if ( !data.hasOwnProperty('lastname') )
		t.fail('Missing "lastname" property in result');
	if ( data.lastname !== newExampleData.lastname )
		t.fail(`Property "lastname" doesn't match with request`);
});

test.serial('[PUT] replace an example', async t => {
	const newReplacedExampleData = {
		"firstname": "Firstname-REPLACED",
		"lastname": "Lastname-REPLACED",
	};
	const {
		data: dataRaw,
		statusCode
	} = await request.put(hostname, port, `${ basePath }/${ newExampleId }`, newReplacedExampleData);
	const data = JSON.parse(dataRaw);

	if ( !isSuccessStatusCode(statusCode) )
		t.fail(`StatusCode isn't a success. Given ${ statusCode }`);
	if ( statusCode !== 200 )
		t.fail(`StatusCode doesn't follow REST guidelines. Expected 200 given ${ statusCode }`);

	if ( !data.hasOwnProperty('firstname') )
		t.fail('Missing "firstname" property in result');
	if ( data.firstname !== newReplacedExampleData.firstname )
		t.fail(`Property "firstname" doesn't match with request`);

	if ( !data.hasOwnProperty('lastname') )
		t.fail('Missing "lastname" property in result');
	if ( data.lastname !== newReplacedExampleData.lastname )
		t.fail(`Property "lastname" doesn't match with request`);
});


test.serial('[DELETE] remove an example', async t => {
	const { data: dataRaw, statusCode } = await request.delete(hostname, port, `${ basePath }/${ newExampleId }`);
	const data = JSON.parse(dataRaw);

	if ( !isSuccessStatusCode(statusCode) )
		t.fail(`StatusCode isn't a success. Given ${ statusCode }`);
	if ( statusCode !== 200 )
		t.fail(`StatusCode doesn't follow REST guidelines. Expected 200 given ${ statusCode }`);

	if ( !data.hasOwnProperty('message') )
		t.fail('Missing "message" property in result');
	if ( data.message !== "Successfully deleted" )
		t.fail(`Message doesn't match with default success message`);

});

test.serial('[DELETE] check deletion of example', async t => {
	const {
		data: deleteRequestDataRaw,
		statusCode: deleteRequestStatusCode
	} = await request.delete(hostname, port, `${ basePath }/${ newExampleId }`);
	const deleteRequestData = JSON.parse(deleteRequestDataRaw);

	if ( !isSuccessStatusCode(deleteRequestStatusCode) )
		t.fail(`StatusCode isn't a success. Given ${ deleteRequestStatusCode }`);
	if ( deleteRequestStatusCode !== 200 )
		t.fail(`StatusCode doesn't follow REST guidelines. Expected 200 given ${ deleteRequestStatusCode }`);

	if ( !deleteRequestData.hasOwnProperty('message') )
		t.fail('Missing "message" property in result');
	if ( deleteRequestData.message !== "No document" )
		t.fail(`Message doesn't match with default success message`);


	const { data: getRequestDataRaw, statusCode: getRequestStatusCode } = await request.get(hostname, port, `${ basePath }/${ newExampleId }`);

	if ( isSuccessStatusCode(getRequestStatusCode) && getRequestDataRaw.length > 0)
		t.fail(`Document still exist in collection`);
	if ( getRequestStatusCode !== 404 )
		t.fail(`Get request doesn't follow REST guidelines. StatusCode expected 404 given ${ getRequestStatusCode }`);
});
