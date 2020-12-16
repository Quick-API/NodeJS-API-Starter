'use-strict';
import { setupEnvVars } from '../../helpers/services/nodeEnvService.js';
import { createRequire } from 'module';


if ( process.env.DB_URI === undefined ) {
	const require = createRequire(import.meta.url);
	require('dotenv').config();
}

setupEnvVars(false);
