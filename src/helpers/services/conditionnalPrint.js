'use-strict';

export function conditionalLog( print = true, message ) {
	if ( print )
		console.log(message);
}
