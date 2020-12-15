export default {
	"files": [
		"src/tests/**/?(*-)+([Ss]pec|[Tt]est).[cjt]s?(x)"
	],
	"concurrency": 5,
	"failFast": true,
	"failWithoutAssertions": false,
	"environmentVariables": {},
	"verbose": true,
	"require": [
		"./src/tests/helpers/testEnvSetupService.js"
	],
	"nodeArguments": [
		"--trace-deprecation",
		"--napi-modules"
	],
	"nonSemVerExperiments": {
		"configurableModuleFormat": true
	},
	"extensions": {
		"js": true,
		"ts": "module"
	}
}
