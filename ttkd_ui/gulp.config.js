var path = require('path');

module.exports = {
	buildDir: 'dist',
	bowerPaths: [
		'./app/lib/moment/min/moment.min.js',
		'./app/lib/angular/angular.min.js',
		'./app/lib/angular-ui-router/release/angular-ui-router.min.js',
		'./app/lib/api-check/dist/api-check.min.js',
		'./app/lib/angular-bootstrap/ui-bootstrap.min.js',
		'./app/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
		'./app/lib/angular-file-upload/dist/angular-file-upload.min.js',
		'./app/lib/ngMask/dist/ngMask.min.js'
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
