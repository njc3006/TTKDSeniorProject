var path = require('path');

module.exports = {
	buildDirProd: path.normalize('../ttkd_api/ttkd_api/dist'),
	buildDirDev: 'dist',
	bowerPaths: [
		'bower_components/angular/angular.min.js',
		'bower_components/angular-ui-router/release/angular-ui-router.min.js',
	],
	sourcePaths: ['!app/**/*_test.js', 'app/**/*.js'],
	templatePaths: ['app/*/**/*.html'],

	sourceSassPaths: ['app/**/*.scss']
};
