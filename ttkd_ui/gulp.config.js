var path = require('path');

module.exports = {
	buildDirProd: path.normalize('../ttkd_api/ttkd_api/dist'),
	buildDirDev: 'dist',
	bowerPaths: [
		'./app/lib/angular/angular.min.js',
		'./app/lib/angular-ui-router/release/angular-ui-router.min.js',
	],
	sourcePaths: ['!./app/**/*_test.js', './app/**/*.js', '!./app/lib/**/*.js'],
	templatePaths: ['./app/*/**/*.html'],

	sourceSassPaths: ['./app/**/*.scss']
};
