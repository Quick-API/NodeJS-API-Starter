export default {
	"files": [
		"src/tests/**/?(*-)+([Ss]pec|[Tt]est).[cjt]s?(x)"
	],
	"concurrency": 5,
	"failFast": true,
	"failWithoutAssertions": false,
	"environmentVariables": {
		"NODE_ENV": "testing",
	},
	"verbose": true,
	"require": [
		"./index.js",
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
