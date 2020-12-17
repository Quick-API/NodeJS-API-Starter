'use-strict';
import http from 'http';
import https from "https";

// noinspection DuplicatedCode
function makeHttpRequest( options, resolve, reject, data = null ) {
	const req = http.request(options, ( response ) => {
		const statusCode = response.statusCode;
		let data = '';

		response.on('data', ( chunk ) => {
			data += chunk;
		});

		response.on('end', () => {
			resolve({
				statusCode: statusCode,
				data: JSON.parse(JSON.stringify(data))
			});
		});

	});

	req.on("error", ( error ) => {
		reject(error);
	});

	if ( data !== null ) {
		let dataStringified;
		if ( typeof data !== 'string' ) dataStringified = JSON.stringify(data);
		else dataStringified = data;

		req.write(dataStringified);
	}

	req.end();
}

// noinspection DuplicatedCode
function makeHttpsRequest( options, resolve, reject, data = null ) {
	const req = https.request(options, ( response ) => {
		const statusCode = response.statusCode;
		let data = '';

		response.on('data', ( chunk ) => {
			data += chunk;
		});

		response.on('end', () => {
			resolve({
				statusCode: statusCode,
				data: JSON.parse(data)
			});
		});

	});

	req.on("error", ( error ) => {
		reject(error);
	});

	if ( data !== null ) {
		let dataStringified;
		if ( typeof data !== 'string' ) dataStringified = JSON.stringify(data);
		else dataStringified = data;

		req.write(dataStringified);
	}

	req.end();
}

export default {
	get: ( hostname, port, path = '/', headers = null, ssl = false ) => {
		const options = {
			hostname,
			port,
			path,
			method: 'GET',
			headers: headers || {
				'Content-Type': 'application/json',
			}
		};

		return new Promise(( resolve, reject ) => {
			if ( ssl ) {
				makeHttpsRequest(options, resolve, reject);
			} else {
				makeHttpRequest(options, resolve, reject);
			}
		});
	},

	post: ( hostname, port, path, data, headers = false, ssl = false ) => {
		const options = {
			hostname,
			port,
			path,
			method: 'POST',
			headers: headers || {
				'Content-Type': 'application/json',
			}
		};

		return new Promise(function ( resolve, reject ) {
			if ( ssl ) {
				makeHttpsRequest(options, resolve, reject, data);
			} else {
				makeHttpRequest(options, resolve, reject, data);
			}
		});
	},

	put: ( hostname, port, path, data, headers = false, ssl = false ) => {
		const options = {
			hostname,
			port,
			path,
			method: 'PUT',
			headers: headers || {
				'Content-Type': 'application/json',
			}
		};

		return new Promise(function ( resolve, reject ) {
			if ( ssl ) {
				makeHttpsRequest(options, resolve, reject, data);
			} else {
				makeHttpRequest(options, resolve, reject, data);
			}
		});
	},

	patch: ( hostname, port, path, data, headers = false, ssl = false ) => {
		const options = {
			hostname,
			port,
			path,
			method: 'PATCH',
			headers: headers || {
				'Content-Type': 'application/json',
			}
		};

		return new Promise(function ( resolve, reject ) {
			if ( ssl ) {
				makeHttpsRequest(options, resolve, reject, data);
			} else {
				makeHttpRequest(options, resolve, reject, data);
			}
		});
	},

	delete: ( hostname, port, path, headers = false, ssl = false ) => {
		const options = {
			hostname,
			port,
			path,
			method: 'DELETE',
			headers: headers || {
				'Content-Type': 'application/json',
			}
		};

		return new Promise(function ( resolve, reject ) {
			if ( ssl ) {
				makeHttpsRequest(options, resolve, reject);
			} else {
				makeHttpRequest(options, resolve, reject);
			}
		});
	},

	options: ( hostname, port, path, data, headers = false, ssl = false ) => {
		const options = {
			hostname,
			port,
			path,
			method: 'OPTIONS',
			headers: headers || {
				'Content-Type': 'application/json',
			}
		};

		return new Promise(function ( resolve, reject ) {
			if ( ssl ) {
				makeHttpsRequest(options, resolve, reject, data);
			} else {
				makeHttpRequest(options, resolve, reject, data);
			}
		});
	},

	head: ( hostname, port, path, data, headers = false, ssl = false ) => {
		const options = {
			hostname,
			port,
			path,
			method: 'HEAD',
			headers: headers || {
				'Content-Type': 'application/json',
			}
		};

		return new Promise(function ( resolve, reject ) {
			if ( ssl ) {
				makeHttpsRequest(options, resolve, reject, data);
			} else {
				makeHttpRequest(options, resolve, reject, data);
			}
		});
	},

}
