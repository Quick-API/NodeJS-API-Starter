'use-strict';

const idParamChecker = ( req, res, next ) => {
	const { id } = req.params;

	if ( !id ) {
		res.status(400).send({
			"code": "MISSING_PARAMS",
			"message": "Missing ID parameter",
			"data": null
		});
	} else if ( typeof id !== 'string' ) {
		res.status(400).send({
			"code": "BAD_PARAMS",
			"message": "Wrong type for ID parameter",
			"data": null
		});
	} else next();
};

const specificIdParamChecker = ( req, res, next ) => {
	const { id } = req.params;

	if ( id !== 'example' ) {
		res.status(400).send({
			"code": "WRONG_PARAMS__ID",
			"message": "Wrong ID parameter",
			"data": null
		});
	} else next();
};

export const exampleMiddleware = {
	idParamChecker,
	specificIdParamChecker
};
