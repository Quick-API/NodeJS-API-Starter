'use-strict';
import mongoose from "mongoose";

if ( process.env.TESTS_CLEAR_BD === "true" )
	for ( const collection in mongoose.connection.collections ) {
		mongoose.connection.collection(collection).drop();
	}
