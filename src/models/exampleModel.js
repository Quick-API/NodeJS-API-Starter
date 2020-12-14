'use-strict';
import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const exampleSchema = new Schema({
	firstname: {
		type: String,
		required: true,
		default: 'john',
		unique: true
	},
	lastname: {
		type: String,
		required: true,
		default: 'doe'
	},
	fullName: {
		type: String,
		required: false,
		default: null
	},
	test: {
		type: Number
	},
	unselectedByDefaultField: {
		type: String,
		select: false,
		default: 'unselectedByDefaultField'
	}
});
