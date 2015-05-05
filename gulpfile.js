// FOUNDATION FOR APPS TEMPLATE GULPFILE
// -------------------------------------
// This file processes all of the assets in the "client" folder, combines them with the Foundation for Apps assets, and outputs the finished files in the "build" folder as a finished app.

// 1. LIBRARIES
// - - - - - - - - - - - - - - -

var $ = require('gulp-load-plugins')();
var argv = require('yargs').argv;
var gulp = require('gulp');
var gulpif = require('gulp-if');
var rimraf = require('gulp-rimraf');
var runSequence = require('run-sequence');

// Check for --production flag
var isProduction = (argv.production);
// Default value for conditions
var defaultVal = true;

// 2. FILE PATHS
// - - - - - - - - - - - - - - -

var config = {
  dev: 'app',
  dist: 'build'
};

var paths = {
  fonts: {
    src: config.dev + '/fonts/**',
    dest: config.dist + '/fonts'
  },
  images: {
    src: config.dev + '/images/**',
    dest: config.dist + '/imges'
  },
  scripts: {
    src: config.dev +  '/scripts/*.js',
    dest: config.dist + '/scripts'
  },
  styles: {
    src: config.dev +  '/styles/*.scss',
    dest: config.dist + '/styles'
  }
};

// 3. TASKS
// - - - - - - - - - - - - - - -

// Cleans the build directory
gulp.task('clean:server', function() {
  return gulp.src(config.dist + '/*', { read: false })
    .pipe(rimraf({ force: true }));
});

// Copies .html template
gulp.task('copy:template', function() {
  return gulp.src(config.app + '/*.html')
    .pipe(gulp.dest(config.dist));
});

// Compile Sass to CSS using Compass
// https://www.npmjs.com/package/gulp-compass
gulp.task('compass', function() {
  if(isProduction){
    defaultVal = false;
  }
  return gulp.src(paths.styles.src)
    .pipe(plumber())
    .pipe(compass({
      config_file: './config.rb',
      css: '.tmp/styles',
      sass: 'app/styles',
      style: (isProduction ? 'compressed' : 'nested'),
      comments: defaultVal,
      sourcemap: defaultVal
    }))
    .pipe(gulp.dest(paths.styles.dest));
});

// Gulp task Compass >Autoprefixer
// Run gulp stylish with flag(--production)
gulp.task('stylish', ['compass'], function() {
  return gulp.src(paths.styles.dest + '/*.css')
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe($.if(!isProduction, $.sourcemaps.write('./')))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(livereload());
});

// Concatenates files
// https://www.npmjs.com/package/gulp-concat
gulp.task('concat', function() {
  return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe($.if(!isProduction, $.sourcemaps.write('./')))
    .pipe(gulp.dest(paths.scripts.dest));
});

// Gulp task Concat >Uglify
// Run gulp compress with flag(--production)
gulp.task('compress', ['concat'], function() {
  return gulp.src(paths.scripts.dest + '/*.js')
    .pipe(plumber())
    .pipe($.if(isProduction, $.uglify({
      compress: {
        drop_console: true
      }
    })))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(livereload());
});

// Copies everything in the client folder except templates, Sass, and JS
gulp.task('copy:fonts', function() {
  return gulp.src(paths.fonts.src, {
  // base: './app/'
  })
    .pipe(gulp.dest(paths.fonts.dest));
});

// Copies everything in the client folder except templates, Sass, and JS
gulp.task('copy:images', function() {
  return gulp.src(paths.images.src, {
  // base: './app/'
  })
    .pipe(gulp.dest(paths.images.dest));
});

// Copies all .html in the app folder
gulp.task('copy:template', function() {
  return gulp.src(config.dev + '/*.html', {
  // base: './app/'
  })
    .pipe(gulp.dest(config.dist));
});

// Gulp task copy:images >imagemin
// Run gulp duplicate with flag(--production)
gulp.task('duplicate:images', ['copy:images'], function() {
  return gulp.src(paths.images.src + '/*.{png,jpg,gif,svg}')
    .pipe($.if(isProduction, imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}]
    })))
    .pipe(gulp.dest(paths.images.dest))
    .pipe(livereload());
});

// Gulp task copy:template >minify-html
// Run gulp duplicate with flag(--production)
gulp.task('duplicate:html', ['copy:template'], function() {
  return gulp.src(config.dist + '/*.html')
    .pipe($.if(isProduction, minifyHTML({
    conditionals: true,
    spare:true
    })))
    .pipe(gulp.dest(config.dist))
    .pipe(livereload());
});

// Gulp plugin to run a local webserver with LiveReload
// https://www.npmjs.com/package/gulp-webserver
gulp.task('server', function() {
  return gulp.src(config.dist)
    .pipe(webserver({
    port: 8080,
    host: 'localhost',
    fallback: 'index.html',
    livereload: true,
    open: true
    }));
});

// Watch, that actually is an endless stream
// https://www.npmjs.com/package/gulp-watch
gulp.task('watch', function () {
  livereload.listen();
  gulp.watch(paths.scripts.src, ['compress']);
  gulp.watch(paths.styles.src, ['stylish']);
  gulp.watch(paths.images.src + '/*.{png,jpg,gif,svg}', ['duplicate:images']);
  gulp.watch(config.dev + '/*.html', ['duplicate:html']);
});

// 4. Custom Tasks
// - - - - - - - - - - - - - - -

// Dev task
gulp.task('dev', ['initial task'], function() {
  // runSequence('task');
});
// Serve task
gulp.task('serve', function() {
  var launchApp = runSequence('server', 'watch');
  setTimeout(launchApp, 500);
});
// Build task with flag(--production)
gulp.task('build', ['clean:server'], function() {
  runSequence('stylish', 'compress', 'copy:fonts', 'duplicate:images', 'duplicate:html');
});
// Default task
gulp.task('default', ['clean:server'], function() {
  runSequence('stylish', 'compress', 'copy:fonts', 'duplicate:images', 'duplicate:html', 'server', 'watch');
});
