'use-strict';
import {
	deleteTestByID,
	getAllExamples,
	getExampleById,
	newExample,
	replaceExampleById
} from "../controllers/exampleController.js";
import { exampleMiddleware } from "../helpers/middlewares/exampleMiddleware.js";

export default function exampleRoutes( app, endpoint ) {
	app.route(`${ endpoint }/examples`)
		.post(newExample)
		.get(getAllExamples);

	app.route(`${ endpoint }/examples/:id`)
		.get([
			exampleMiddleware.idParamChecker,
			exampleMiddleware.specificIdParamChecker
		], getExampleById)
		.put([ exampleMiddleware.idParamChecker ], replaceExampleById)
		.delete([ exampleMiddleware.idParamChecker ], deleteTestByID);
}
