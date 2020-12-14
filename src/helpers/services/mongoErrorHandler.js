'use-strict';

export default function ( res, err ) {
	if ( err.hasOwnProperty('reason')
		&& err.reason.hasOwnProperty('code') && typeof err.reason.code === 'number' ) {
		const errorCodeStringify = err.reason.code.toString();
		switch ( errorCodeStringify ) {
			case '01005':
				res.status(400).send({
					"code": "CREATE_IMPOSSIBLE",
					"message": "Cannot insert this record.",
					"data": null
				});
				break;


			case '01006':
				res.status(400).send({
					"code": "UPDATE_IMPOSSIBLE",
					"message": "Cannot update this record.",
					"data": null
				});
				break;


			case '01007':
				res.status(400).send({
					"code": "DELETE_IMPOSSIBLE",
					"message": "Cannot delete this record.",
					"data": null
				});
				break;


			case '01008':
				res.status(400).send({
					"code": "FETCH_IMPOSSIBLE",
					"message": "Cannot fetch this record.",
					"data": null
				});
				break;


			case '01009':
				res.status(400).send({
					"code": "SERVER_DOWN",
					"message": "The server is down.",
					"data": null
				});
				break;

			case '11000':
				let propertiesWithConstraint = [];

				// noinspection JSUnresolvedVariable
				for ( const keyPatternKey in err.keyPattern ) {
					// noinspection JSUnresolvedVariable
					if ( keyPatternKey !== undefined
						&& err.keyPattern.hasOwnProperty(keyPatternKey) )
						propertiesWithConstraint.push(keyPatternKey);
				}

				res.status(400).send({
					"code": "MODEL_CONSTRAINT__UNIQUE",
					"message": "Couldn't create this object due to model's restrictions: unique keys on.",
					"data": {
						"properties_with_unique_constraint": propertiesWithConstraint
					}
				});
				break;

			default:
				let data = null;

				if ( process.env.NODE_ENV === "development" )
					data = { "Native error": err };

				res.status(500).send({
					"code": "UNKNOWN_MONGO_ERROR",
					"message": "An unknown error occurred. It could be undocumented or completely unknown",
					"data": data
				});
				break;
		}
	} else if ( err.hasOwnProperty('reason')
		&& err.reason.hasOwnProperty('code') && typeof err.reason.code === 'string' ) {
		switch ( err.reason.code ) {
			default:
				let data = null;

				if ( process.env.NODE_ENV === "development" )
					data = { "Native error": err };

				res.status(500).send({
					"code": "UNKNOWN_MONGO_ERROR",
					"message": "An unknown error occurred. It could be undocumented or completely unknown",
					"data": data
				});
				break;
		}
	} else {
		let data = null;

		if ( process.env.NODE_ENV === "development" )
			data = { "Native error": err };

		res.status(500).send({
			"code": "UNKNOWN_MONGO_ERROR",
			"message": "An unknown error occurred. It could be undocumented or completely unknown",
			"data": data
		});
	}
}
