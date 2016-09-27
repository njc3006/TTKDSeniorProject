var argv = require('yargs').argv;
var isProduction = (argv.production === undefined) ? false : true;

var gulp = require('gulp'),
	del = require('del');

// Import the config
var config = require('./gulp.config');

// Dependencies for building js
var concat = require('gulp-concat'),
	uglify = require('gulp-uglify');

// Dependencies for building sass
var sass = require('gulp-sass'),
	cleanCSS = require('gulp-clean-css');

// Dependencies for copying over HTML
var rename = require('gulp-rename');

// Dependencies for template caching
var templateCache = require('gulp-angular-templatecache');

// JSHint
var jshint = require('gulp-jshint');

// Dependencies to run the dev server
var webserver = require('gulp-webserver');

const BUILD_DIR = isProduction ? config.buildDirProd : config.buildDirDev;

gulp.task('clean', function(cb) {
	var options = {force: true};

    del.sync([BUILD_DIR], options);
});

gulp.task('build-template-cache', function() {
	return gulp.src(config.templatePaths)
		.pipe(templateCache('templates.js', {
			module: 'ttkdApp'
		}))
		.pipe(gulp.dest(BUILD_DIR + '/js'))
});

gulp.task('build-bower', function() {
	return gulp.src(config.bowerPaths)
		.pipe(concat('vendor.js'))
		.pipe(uglify())
		.pipe(gulp.dest(BUILD_DIR + '/js'))
});

gulp.task('build-js', function() {
	return gulp.src(config.sourcePaths)
		.pipe(concat('app.js'))
		.pipe(uglify())
		.pipe(gulp.dest(BUILD_DIR + '/js'))
});

gulp.task('build-css', function() {
    return gulp.src(config.sourceSassPaths)
        .pipe(sass().on('error', sass.logError))
		.pipe(cleanCSS())
        .pipe(gulp.dest(BUILD_DIR + '/css'));
});

gulp.task('copy-html', function() {
	var indexPath = isProduction ? './app/index_prod.html' : './app/index_dev.html';

	return gulp.src(indexPath, {base: './app'})
		.pipe(rename('index.html'))
		.pipe(gulp.dest(BUILD_DIR));
});

gulp.task('jshint', function() {
    return gulp.src(config.sourcePaths)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
    return gulp.watch([
		'app/index.html','app/*/**/*.html', 'app/**/*.scss', 'app/**/*.js'
	], ['build']);
});

gulp.task('build', ['clean', 'jshint', 'build-bower', 'build-js', 'build-template-cache', 'build-css', 'copy-html']);

gulp.task('serve', function() {
	return gulp.src(BUILD_DIR)
		.pipe(webserver({
			port: 3000,
			livereload: true,
			directoryListing: true,
            open: 'http://localhost:3000/index.html'
		}));
});

/*var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    del = require('del'),
    sass = require('gulp-sass'),
    karma = require('gulp-karma'),
    jshint = require('gulp-jshint'),
    sourcemaps = require('gulp-sourcemaps'),
    spritesmith = require('gulp.spritesmith'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    ngAnnotate = require('browserify-ngannotate');

var CacheBuster = require('gulp-cachebust');
var cachebust = new CacheBuster();

/////////////////////////////////////////////////////////////////////////////////////
//
// cleans the build output
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('clean', function (cb) {
    del([
        'dist'
    ], cb);
});

/////////////////////////////////////////////////////////////////////////////////////
//
// runs bower to install frontend dependencies
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('bower', function() {

    var install = require("gulp-install");

    return gulp.src(['./bower.json'])
        .pipe(install());
});

/////////////////////////////////////////////////////////////////////////////////////
//
// runs sass, creates css source maps
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-css', ['clean'], function() {
    return gulp.src('./*.sass')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(cachebust.resources())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./dist'));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// runs jshint
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('jshint', function() {
    gulp.src('/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// Build a minified Javascript bundle - the order of the js files is determined
// by browserify
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-js', ['clean'], function() {
    var b = browserify({
        entries: './app/app.js',
        debug: true,
        paths: ['./app/'],
        transform: [ngAnnotate]
    });

    return b.bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(cachebust.resources())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/'));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// full build (except sprites), applies cache busting to the main page css and js bundles
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build', [ 'clean', 'bower','build-css','build-template-cache', 'jshint', 'build-js'], function() {
    return gulp.src('index.html')
        .pipe(cachebust.references())
        .pipe(gulp.dest('dist'));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// watches file system and triggers a build when a modification is detected
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('watch', function() {
    return gulp.watch(['./index.html','./partials/*.html', './styles/*.*css', './js/**.js'], ['build']);
});

/////////////////////////////////////////////////////////////////////////////////////
//
// launches a web server that serves files in the current directory
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('webserver', ['watch','build'], function() {
    gulp.src('.')
        .pipe(webserver({
            livereload: false,
            directoryListing: true,
            open: "http://localhost:8000/dist/index.html"
        }));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// launch a build upon modification and publish it to a running server
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('dev', ['watch', 'webserver']);

/////////////////////////////////////////////////////////////////////////////////////
//
// installs and builds everything, including sprites
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('default', ['build', 'test']);*/
