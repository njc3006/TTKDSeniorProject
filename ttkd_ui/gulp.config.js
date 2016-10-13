var path = require('path');

module.exports = {
	buildDir: 'dist',
	bowerPaths: [
		'./app/lib/moment.js',
		'./app/lib/angular/angular.min.js',
		'./app/lib/angular-ui-router/release/angular-ui-router.min.js',
		'./app/lib/api-check/dist/api-check.min.js',
		'./app/lib/angular-bootstrap/ui-bootstrap.min.js',
		'./app/lib/angular-bootstrap/ui-bootstrap.tpls.min.js',
		'./app/lib/angular-formly/dist/formly.min.js',
		'./app/lib/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap.min.js',
		'./app/lib/angular-formly-repeating-section/dist/angular-formly-repeating-section.js'
	],
	sourcePaths: ['!./app/**/*_test.js', './app/**/*.js', '!./app/lib/**/*.js'],
	templatePaths: ['./app/*/**/*.html'],
	fontFiles: [
		'./app/lib/**/*.woff',
		'./app/lib/**/*.woff2',
		'./app/lib/**/*.ttf'
	],

	sourceSassPaths: ['./app/**/*.scss']
};
