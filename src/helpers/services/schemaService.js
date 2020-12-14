'use-strict';

function getMissingFields( schema, data ) {
	let missingFields = [];

	for ( const schemaObjProperty in schema.obj ) {
		if ( schema.obj.hasOwnProperty(schemaObjProperty) && !data.hasOwnProperty(schemaObjProperty) )
			missingFields.push(schemaObjProperty);
	}

	return missingFields;
}

function getUnknownFields( schema, data ) {
	let unknownFields = [];

	for ( const dataProperty in data ) {
		if ( data.hasOwnProperty(dataProperty) && !schema.obj.hasOwnProperty(dataProperty) )
			unknownFields.push(dataProperty);
	}

	return unknownFields;
}

function getMissingRequiredFields( schema, data ) {
	let missingFields = [];

	for ( const schemaObjProperty in schema.obj ) {
		if ( schema.obj.hasOwnProperty(schemaObjProperty)
			&& schema.obj[schemaObjProperty].hasOwnProperty('required')
			&& schema.obj[schemaObjProperty].required
			&& !data.hasOwnProperty(schemaObjProperty) )
			missingFields.push(schemaObjProperty);
	}

	return missingFields;
}

function getBadTypedFields( schema, data ) {
	let badTypedFields = [];

	for ( const schemaObjProperty in schema.obj ) {
		if ( data.hasOwnProperty(schemaObjProperty) ) {
			let dataType = typeof data[schemaObjProperty];
			dataType = dataType.charAt(0).toUpperCase() + dataType.slice(1);

			switch ( schema.obj[schemaObjProperty].type.name ) {

				case 'Array':
					if ( !data[schemaObjProperty].isArray() ) {
						badTypedFields.push({
							"field": schemaObjProperty,
							"expected_type": "Array",
							"received_type": dataType,
						});
					}
					break;

				case 'Boolean':
					if ( typeof data[schemaObjProperty] !== 'boolean' ) {
						badTypedFields.push({
							"field": schemaObjProperty,
							"expected_type": "Boolean",
							"received_type": dataType,
						});
					}
					break;

				case 'Number':
					if ( typeof parseInt(data[schemaObjProperty]) !== 'number' ) {
						badTypedFields.push({
							"field": schemaObjProperty,
							"expected_type": "Number",
							"received_type": dataType,
						});
					}
					break;

				case 'ObjectId':
				case 'String':
					if ( typeof data[schemaObjProperty] !== 'string' ) {
						badTypedFields.push({
							"field": schemaObjProperty,
							"expected_type": "String",
							"received_type": dataType,
						});
					}
					break;

				// case 'Buffer':
				// 	break;

				// case 'Date':
				// 	break;

				// case 'Decimal128':
				// 	break;

				// case 'DocumentArray':
				// 	break;

				// case 'Map':
				// 	break;

				// case 'Mixed':
				// 	break;

				// case 'Embedded':
				// 	break;

				default:
					badTypedFields.push({
						"field": schemaObjProperty,
						"expected_type": "Unknown",
						"received_type": dataType,
						"error": process.env.NODE_ENV === "development"
							? "Type not implemented in getBadTypedFields() of schemaService"
							: "Unknown field type"
					});
					break;
			}
		}
	}

	return badTypedFields;
}

export function allSchemaFieldsPresenceShield( schema, data ) {
	const missingFields = getMissingFields(schema, data);
	const unknownFields = getUnknownFields(schema, data);
	let code = null;
	let message = null;
	let returnedData = null;
	let hasAnError = false;

	if ( missingFields.length > 0 ) {
		hasAnError = true;
		code = "MISSING_FIELDS";
		message = "Your object is malformed for this route: Required fields are missing";
		returnedData = {
			"missing_fields": missingFields
		};
	}

	if ( unknownFields.length > 0 ) {
		hasAnError = true;
		code = "UNKNOWN_FIELDS";
		message = "Your object is malformed for this route: You add unknown fields";
		returnedData = {
			"unknown_fields": missingFields
		};
	}

	if ( missingFields.length > 0 && unknownFields.length > 0 ) {
		hasAnError = true;
		code = "MISSING_AND_UNKNOWN_FIELDS";
		message = "Your object is malformed for this route: Required fields are missing, and you add unknown one.";
		returnedData = {
			"missing_fields": missingFields,
			"unknown_fields": unknownFields
		};
	}

	if ( hasAnError ) {
		return {
			"code": code,
			"message": message,
			"data": returnedData
		};
	} else return true;
}

export function isDataHasRequiredSchemaFields( schema, data ) {
	const missingFields = getMissingRequiredFields(schema, data);
	const unknownFields = getUnknownFields(schema, data);
	let code = null;
	let message = null;
	let returnedData = null;
	let hasAnError = false;

	if ( missingFields.length > 0 ) {
		hasAnError = true;
		code = "MISSING_FIELDS";
		message = "Your object is malformed for this route: Required fields are missing";
		returnedData = {
			"missing_fields": missingFields
		}
	}

	if ( unknownFields.length > 0 ) {
		hasAnError = true;
		code = "UNKNOWN_FIELDS";
		message = "Your object is malformed for this route: You add unknown fields";
		returnedData = {
			"unknown_fields": missingFields
		}
	}

	if ( missingFields.length > 0 && unknownFields.length > 0 ) {
		hasAnError = true;
		code = "MISSING_AND_UNKNOWN_FIELDS";
		message = "Your object is malformed for this route: Required fields are missing, and you add unknown one.";
		returnedData = {
			"missing_fields": missingFields,
			"unknown_fields": unknownFields
		};
	}


	if ( hasAnError ) {
		return {
			"code": code,
			"message": message,
			"data": returnedData
		};
	} else return true;
}

export function isDataRespectSchemaTypes( schema, data ) {
	const badTypeFieldsResult = getBadTypedFields(schema, data);

	if ( badTypeFieldsResult.length > 0 ) {
		return {
			"code": "INVALID_FIELDS_TYPE",
			"message": "At least one field does not follow schema types",
			"data": {
				"invalid_type_fields": badTypeFieldsResult
			}
		};
	}
	return true;
}
