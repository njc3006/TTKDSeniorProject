var path = require('path');

module.exports = {
	buildDirProd: path.normalize('../ttkd_api/ttkd_api/dist'),
	buildDirDev: 'dist',
	bowerPaths: [
		'./app/lib/angular/angular.js',
		'./app/lib/angular-ui-router/release/angular-ui-router.js',
		'./app/lib/angular-bootstrap/ui-bootstrap.js',
		'./app/lib/angular-bootstrap/ui-bootstrap-tpls.js',
		'./app/lib/angular-ui-select/dist/select.js'
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
