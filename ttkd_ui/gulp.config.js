var path = require('path');

module.exports = {
	buildDirProd: path.normalize('../ttkd_api/ttkd_api/dist'),
	buildDirDev: 'dist',
	bowerPaths: [
		'./app/lib/angular/angular.min.js',
		'./app/lib/angular-ui-router/release/angular-ui-router.min.js',
		'./app/lib/api-check/dist/api-check.min.js',
		'./app/lib/angular-bootstrap/ui-bootstrap.min.js',
		'./app/lib/angular-bootstrap/ui-bootstrap.tpls.min.js',
		'./app/lib/angular-formly/dist/formly.min.js',
		'./app/lib/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap.min.js'
	],
	sourcePaths: ['!./app/**/*_test.js', './app/**/*.js', '!./app/lib/**/*.js'],
	templatePaths: ['./app/*/**/*.html'],

	sourceSassPaths: ['./app/**/*.scss']
};
