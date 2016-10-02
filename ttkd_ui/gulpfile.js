var argv = require('yargs').argv;

var gulp = require('gulp');
var del = require('del');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var ngHtml2Js = require("gulp-ng-html2js");
var rename = require('gulp-rename');
var server = require('gulp-server-livereload');
var connect = require('gulp-connect');
var install = require("gulp-install");
var run = require('gulp-run');

const config = require('./gulp.config');
const BUILD_DIR = argv.production ? config.buildDirProd : config.buildDirDev;

gulp.task('clean', function (cb) {
    del([
        'dist'
    ], cb);
});

gulp.task( 'server', ['build'], function() {
	connect.server({
		port: 3000,
		root: BUILD_DIR,
		livereload: true
	});
});

gulp.task('scss', [], function(done) {
  gulp.src('./app/app.scss')
    .pipe(sass())
    .on('error', function(error) {
      console.error(error.toString());
      this.emit('end');
    })
    .pipe(gulp.dest('dist'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.css' }))
    .pipe(gulp.dest(BUILD_DIR + '/css'))
		.pipe(connect.reload())
    .on('end', done);
});

gulp.task('jshint', [], function(done) {
  gulp.src(['./app/**/*.js','!./app/lib/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .on('end', done);
});

gulp.task('build-templates', [], function(done) {
	gulp.src(config.templatePaths)
		.pipe(sourcemaps.init())
	    .pipe(ngHtml2Js({
	        moduleName: 'ttkdApp.partials'
	    }))
	    .pipe(concat('partials.js'))
	    .pipe(uglify())
		.pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest(BUILD_DIR + '/js'))
		.pipe(connect.reload())
		.on('end', done);
});

gulp.task('build-js-libs', [], function(done) {
	if (argv.production) {
		gulp.src(config.bowerPaths)
			.pipe(concat('vendor.js'))
			.pipe(uglify())
			.pipe(gulp.dest(BUILD_DIR + '/js'))
			.pipe(connect.reload())
			.on('end', done);
	} else {
		gulp.src(config.bowerPaths)
			.pipe(sourcemaps.init())
				.pipe(concat('vendor.js'))
				.pipe(uglify())
			.pipe(sourcemaps.write('../maps'))
			.pipe(gulp.dest(BUILD_DIR + '/js'))
			.pipe(connect.reload())
			.on('end', done);
	}
});

gulp.task('build-js', [], function(done) {
	gulp.src(config.sourcePaths)
		.pipe(sourcemaps.init())
			.pipe(concat('app.js'))
			.pipe(uglify())
		.pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest(BUILD_DIR + '/js'))
		.pipe(connect.reload())
		.on('end', done);
});

gulp.task('build-static', [], function(done) {
	var indexFile = argv.production ? './app/index_prod.html' : './app/index_dev.html';

	gulp.src([indexFile])
		.pipe(rename('index.html'))
		.pipe(gulp.dest(BUILD_DIR))
		.pipe(connect.reload())
		.on('end', done);
})

gulp.task('watch', function() {
  gulp.watch('./app/**/*.scss', ['scss']);
  gulp.watch(['./app/**/*.js', '!./app/lib/**/*.js'], ['build-js', 'jshint']);
  gulp.watch(['./app/**', '!./app/**/*.js', '!./app/**/*.scss'], ['build-static']);
	gulp.watch(config.templatePaths, ['build-templates'])
});

gulp.task('bootstrap', [], function(done) {
  var ends = 5;
  function end() {
    if (--ends) return;
    done();
  }
  gulp.src(['./node_modules/bootstrap/dist/**/', '!./**/npm.js'], {base: './node_modules/bootstrap/dist'})
    .pipe(gulp.dest('./app/lib/bootstrap/'))
    .on('end', end);
  gulp.src(['./node_modules/bootstrap/docs/assets/js/ie10-viewport-bug-workaround.js'], {base: './node_modules/bootstrap/docs/assets'})
    .pipe(gulp.dest('./app/lib/assets/'))
    .on('end', end);
  gulp.src(['./node_modules/html5shiv/dist/**/*'])
    .pipe(gulp.dest('./app/lib/html5shiv/'))
    .on('end', end);
  gulp.src(['./node_modules/Respond.js/dest/**/*'])
    .pipe(gulp.dest('./app/lib/respond/'))
    .on('end', end);
  gulp.src(['./node_modules/jquery/dist/*', '!./**/cdn'])
    .pipe(gulp.dest('./app/lib/jquery/'))
    .on('end', end);
});

gulp.task('angular-ui-bootstrap-install', function(done) {
  //~ process.chdir('node_modules/angular-ui-bootstrap');
  return gulp.src(['./node_modules/angular-ui-bootstrap/package.json'])
    .pipe(gulp.dest('./node_modules/angular-ui-bootstrap'))
    .pipe(install())

});

gulp.task('angular-ui-bootstrap-grunt', ['angular-ui-bootstrap-install'], function(done) {
  run('grunt --base ./node_modules/angular-ui-bootstrap --gruntfile ./node_modules/angular-ui-bootstrap/gruntfile.js html2js build')
    .exec('', function() {
      done();
    });
});

gulp.task('angular-ui-bootstrap', ['angular-ui-bootstrap-grunt'], function(done) {
  var ends = 1;
  function end() {
    if (--ends) return;
    done();
  }
  gulp.src(['./node_modules/angular-ui-bootstrap/dist/**/*.js'])
    .pipe(rename(function (path) {
        path.basename = 'angular-' + path.basename.replace(/-\d\..*?(\.min)?$/, '$1');
    }))
    .pipe(gulp.dest('./app/lib/angular/js/'))
    .on('end', end);
});

gulp.task('angular', [], function(done) {
  var ends = 6;
  function end() {
    if (--ends) return;
    done();
  }
  gulp.src(['./node_modules/angular/angular.js', './node_modules/angular/**/angular.min.js'])
    .pipe(gulp.dest('./app/lib/angular/js/'))
    .on('end', end);
  gulp.src(['./node_modules/angular-ui-router/release/**/*'])
    .pipe(gulp.dest('./app/lib/angular/js/'))
    .on('end', end);
  gulp.src(['./node_modules/angular/angular-csp.css'])
    .pipe(gulp.dest('./app/lib/angular/css/'))
    .on('end', end);
  gulp.src(['./node_modules//angular-animate/angular-animate.*'])
    .pipe(gulp.dest('./app/lib/angular/js/'))
    .on('end', end);
  gulp.src(['./node_modules/angular-ui-bootstrap/src/*/*.js'])
    .pipe(concat('angular-ui-bootstrap.js'))
    .pipe(gulp.dest('./app/lib/angular/js'))
    .on('end', end);
  gulp.src(['./node_modules/angular-ui-bootstrap/src/*/*.js'])
    .pipe(uglify('angular-ui-bootstrap.min.js',{
      outSourceMap: true
    }))
    .pipe(gulp.dest('./app/lib/angular/js'))
    .on('end', end);
});

gulp.task('require', [], function(done) {
  var ends = 1;
  function end() {
    if (--ends) return;
    done();
  }
  gulp.src(['./node_modules/requirejs/require.js'])
    .pipe(gulp.dest('./app/lib/require'))
    .on('end', end);
});

gulp.task('install', ['angular', 'require', 'bootstrap', 'angular-ui-bootstrap'], function(done) {
  done()
});

gulp.task('build', ['scss', 'build-js', 'build-js-libs', 'build-templates', 'build-static'], function(done) {
  done()
});

gulp.task('default', ['server','watch', 'jshint']);
