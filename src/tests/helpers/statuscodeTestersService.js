'use-strict';

export function isInfoStatusCode(code) {
	return code >= 100 && code < 200;
}

export function isSuccessStatusCode(code) {
	return code >= 200 && code < 300;
}

export function isRedirectionStatusCode(code) {
	return code >= 300 && code < 400;
}

export function isClientErrorStatusCode(code) {
	return code >= 400 && code < 500;
}

export function isServerErrorStatusCode(code) {
	return code >= 500 && code < 600;
}


