'use-strict';
import mongoose from "mongoose";
import mongoErrorHandler from "../helpers/services/mongoErrorHandler.js";
import { exampleSchema } from "../models/exampleModel.js";
import {
	allSchemaFieldsPresenceShield,
	isDataHasRequiredSchemaFields,
	isDataRespectSchemaTypes
} from "../helpers/services/schemaService.js";


const ExampleModel = mongoose.model('ExampleModel', exampleSchema);


export function newExample( req, res ) {
	const isDataRespectSchemaTypesResult = isDataRespectSchemaTypes(exampleSchema, req.body);
	if ( isDataRespectSchemaTypesResult !== true ) {
		res.status(400).send(isDataRespectSchemaTypesResult);
		return;
	}

	const isDataHasRequiredSchemaFieldsResult = isDataHasRequiredSchemaFields(exampleSchema, req.body);
	if ( isDataHasRequiredSchemaFieldsResult !== true ) {
		res.status(400).send(isDataHasRequiredSchemaFieldsResult);
		return;
	}

	const newDocument = new ExampleModel(req.body);

	newDocument.save(( err, doc ) => {
		if ( err ) {
			mongoErrorHandler(res, err);
		} else {
			res.status(201).send(doc);
		}
	});
}


export function getAllExamples( req, res ) {
	ExampleModel.find({}, ( err, doc ) => {
		if ( err ) {
			mongoErrorHandler(res, err);
		} else {
			res.send(doc);
		}
	})
}


export function getExampleById( req, res ) {
	ExampleModel.findById(req.params.id, ( err, test ) => {
		if ( err ) {
			mongoErrorHandler(res, err);
		} else {
			res.send(test);
		}
	})
}


export function replaceExampleById( req, res ) {
	allSchemaFieldsPresenceShield(exampleSchema, req.body, res);

	ExampleModel.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true, // Force to return the new updated object
	}, ( err, test ) => {
		if ( err ) {
			mongoErrorHandler(res, err);
		} else {
			res.status(201).send(test);
		}
	})
}


export function deleteTestByID( req, res ) {
	ExampleModel.findById({ _id: req.params.id }, ( err, doc ) => {
		if ( err ) {
			mongoErrorHandler(res, err);
		} else if ( !doc ) {
			res.send({ "message": "No document" });
		} else {
			ExampleModel.deleteOne({ _id: req.params.id }, {}, ( err, result ) => {
				if ( err ) {
					mongoErrorHandler(res, err);
				} else {
					res.send({ "message": "successfully deleted" });
				}
			});
		}
	});

}

