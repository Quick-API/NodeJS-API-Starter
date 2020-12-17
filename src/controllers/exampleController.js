'use-strict';
import mongoose from "mongoose";
import { exampleSchema } from "../models/exampleModel.js";
import {
	allSchemaFieldsPresenceShield,
	isDataHasRequiredSchemaFields,
	isDataRespectSchemaTypes
} from "../helpers/services/schemaService.js";
import { isTestingEnvironment } from "../helpers/services/nodeEnvService.js";

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
			if ( isTestingEnvironment )
				res.status(500).send(err);
			else res.status(400).send({
				"code": "DATABASE_ERROR",
				"message": "An error occurs while processing your request on our database.",
				"data": null
			})
		} else {
			res.status(201).send(doc);
		}
	});
}


export function getAllExamples( req, res ) {
	ExampleModel.find({}, ( err, doc ) => {
		if ( err ) {
			if ( isTestingEnvironment )
				res.status(500).send(err);
			else res.status(400).send({
				"code": "DATABASE_ERROR",
				"message": "An error occurs while processing your request on our database.",
				"data": null
			})
		} else {
			res.send(doc);
		}
	})
}


export function getExampleById( req, res ) {
	ExampleModel.findById(req.params.id, ( err, test ) => {
		if ( err ) {
			if ( isTestingEnvironment )
				res.status(500).send(err);
			else res.status(404).send({
				"code": "DATABASE_ERROR",
				"message": "An error occurs while processing your request on our database.",
				"data": null
			})
		} else {
			if ( test && Object.entries(test).length > 0 ) res.send(test);
			else res.status(404).send({
				"code": "RESOURCE_NOT_FOUND",
				"message": "The resource you are looking for cannot be found.",
				"data": null
			})
		}
	})
}


export function replaceExampleById( req, res ) {
	allSchemaFieldsPresenceShield(exampleSchema, req.body, res);

	ExampleModel.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true, // Force to return the new updated object
	}, ( err, test ) => {
		if ( err ) {
			if ( isTestingEnvironment )
				res.status(500).send(err);
			else res.status(400).send({
				"code": "DATABASE_ERROR",
				"message": "An error occurs while processing your request on our database.",
				"data": null
			})
		} else {
			res.status(200).send(test);
		}
	})
}


export function deleteTestByID( req, res ) {
	ExampleModel.findById({ _id: req.params.id }, ( err, doc ) => {
		if ( err ) {
			if ( isTestingEnvironment )
				res.status(500).send(err);
			else res.status(400).send({
				"code": "DATABASE_ERROR",
				"message": "An error occurs while processing your request on our database.",
				"data": null
			})
		} else if ( !doc ) {
			res.send({ "message": "No document" });
		} else {
			ExampleModel.deleteOne({ _id: req.params.id }, {}, ( err, result ) => {
				if ( err ) {
					if ( isTestingEnvironment )
						res.status(500).send(err);
					else res.status(400).send({
						"code": "DATABASE_ERROR",
						"message": "An error occurs while processing your request on our database.",
						"data": null
					})
				} else {
					res.send({ "message": "Successfully deleted" });
				}
			});
		}
	});

}

