// FOUNDATION FOR APPS TEMPLATE GULPFILE
// -------------------------------------
// This file processes all of the assets in the "client" folder, combines them with the Foundation
// for Apps assets, and outputs the finished files in the "build" folder as a finished app.

// 1. LIBRARIES
// - - - - - - - - - - - - - - -

var gulp           = require('gulp'),
    rimraf         = require('rimraf'),
    runSequence    = require('run-sequence'),
    frontMatter    = require('gulp-front-matter'),
    autoprefixer   = require('gulp-autoprefixer'),
    sass           = require('gulp-ruby-sass'),
    uglify         = require('gulp-uglify'),
    concat         = require('gulp-concat'),
    gulpFile       = require('gulp-file'),
    rename         = require('gulp-rename'),
    series         = require('stream-series'),
    path           = require('path');

// 2. SETTINGS VARIABLES
// - - - - - - - - - - - - - - -

// Sass will check these folders for files when you use @import.
var sassPaths = [
  'client/assets/scss',
  'bower_components/foundation-apps/scss'
];
// These files include Foundation for Apps and its dependencies
var foundationJS = [
  'bower_components/fastclick/lib/fastclick.js',
  'bower_components/viewport-units-buggyfill/viewport-units-buggyfill.js',
  'bower_components/tether/tether.js',
  'bower_components/angular/angular.js',
  'bower_components/angular-animate/angular-animate.js',
  'bower_components/ui-router/release/angular-ui-router.js',
  'bower_components/foundation-apps/js/vendor/**/*.js',
  'bower_components/foundation-apps/js/angular/**/*.js',
  '!bower_components/foundation-apps/js/angular/app.js'
];
// These files are for your app's JavaScript
var appJS = [
  'client/assets/js/app.js'
];

// 3. TASKS
// - - - - - - - - - - - - - - -

// Cleans the build directory
gulp.task('clean', function(cb) {
  rimraf('./build', cb);
});

// Copies user-created files and Foundation assets
gulp.task('copy', function() {
  // Copy the index.html, images, and templates to the build directory
  gulp.src(['./client/index.html', './client/templates/**/*'], { base: './client/'})
    .pipe(gulp.dest('./build'));

  // // Iconic SVG icons
  gulp.src('./bower_components/foundation-apps/iconic/**/*')
    .pipe(gulp.dest('./build/assets/img/iconic/'));

  // // Foundation's Angular partials
  return gulp.src(['./bower_components/foundation-apps/js/angular/components/**.*'])
    .pipe(gulp.dest('./build/components/'));
});

// Compile the foundationJS into a single JavaScript
gulp.task('foundationJS', function() {
  return gulp.src(foundationJS)
    .pipe(concat('foundation-built.js'))
    .pipe(gulp.dest('./bower_components/foundation-apps/'))
});

gulp.task('foundationSass', function() {
  // return gulp.src('client/assets/scss/app.scss')
  return gulp.src(['./client/assets/scss/_settings.scss', './bower_components/foundation-apps/scss/foundation.scss'])
    .pipe(sass({
      'sourcemap=none': true,
      loadPath: sassPaths,
      style: 'nested',
      bundleExec: true
    }))
    .on('error', function(e) {
      console.log(e);
    })
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie 10']
    }))
    .pipe(rename('foundation-built.css'))
    .pipe(gulp.dest('./bower_components/foundation-apps/'));
});

gulp.task('vendor', function() {
  // Foundation JavaScript
  gulp.src('./bower_components/foundation-apps/foundation-built.css')
    .pipe(rename('foundation.min.css'))
    .pipe(gulp.dest('./build/assets/css/'));

  var foundation = gulp.src("./bower_components/foundation-apps/foundation-built.js")
    .pipe(uglify());

  var other = gulp.src(['./node_modules/angular-aerobatic/angular-aerobatic.min.js'])
    .pipe(concat('other.min.js'));

   return series(foundation, other)
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('./build/assets/js'));
});

// Compile all the custom sass into a single minified css
gulp.task('sass', function() {
  return gulp.src(['./client/assets/scss/**/*.scss', '!./client/assets/scss/_settings.scss'])
    .pipe(sass({
      'sourcemap=none': true,
      loadPath: sassPaths,
      style: 'compact',
      bundleExec: true
    }))
    .on('error', function(e) {
      console.log(e);
    })
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie 10']
    }))
    .pipe(rename('app.min.css'))
    .pipe(gulp.dest('./build/assets/css/'));
});

// Compiles and copies the Foundation for Apps JavaScript, as well as your app's custom JS
gulp.task('uglify', function() {
  // App JavaScript
  return gulp.src(appJS)
    .pipe(uglify({
      beautify: true,
      mangle: false
    }).on('error', function(e) {
      console.log(e);
    }))
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('./build/assets/js/'));
});

gulp.task('foundation', ['foundationJS', 'foundationSass']);

// Builds your entire app once, without starting a server
gulp.task('build', ['clean'], function() {
  runSequence('foundation', ['copy', 'sass', 'uglify', 'vendor'], function() {
    console.log("Successfully built.");
  });
});

// gulp.task('watch', function() {
//   gulp.watch(['./client/assets/scss/**/*', './scss/**/*'], ['sass']);

//   // Watch JavaScript
//   gulp.watch(['./client/assets/js/**/*', './js/**/*'], ['uglify']);

//   // Watch static files
//   gulp.watch(['./client/**/*.*', '!./client/templates/**/*.*', '!./client/assets/{scss,js}/**/*.*'], ['copy']);

//   // Watch app templates
//   gulp.watch(['./client/templates/**/*.html'], ['copy-templates']);
// });

// // Default task: builds your app, starts a server, and recompiles assets when they change
// gulp.task('default', ['build'], function() {
//   // Watch Sass
//   gulp.watch(['./client/assets/scss/**/*', './scss/**/*'], ['sass']);

//   // Watch JavaScript
//   gulp.watch(['./client/assets/js/**/*', './js/**/*'], ['uglify']);

//   // Watch static files
//   gulp.watch(['./client/**/*.*', '!./client/templates/**/*.*', '!./client/assets/{scss,js}/**/*.*'], ['copy']);

//   // Watch app templates
//   gulp.watch(['./client/templates/**/*.html'], ['copy-templates']);
// });
