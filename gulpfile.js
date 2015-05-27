// This file processes all of files in the "app" folder, and outputs files in the "build" folder for distribution ready.

// ---------- Libraries ----------

var $ = require('gulp-load-plugins')();
var argv = require('yargs').argv;
var gulp = require('gulp');
var gulpif = require('gulp-if');
var rimraf = require('gulp-rimraf');
var runSequence = require('run-sequence');
var minifyHTML = require('gulp-minify-html');

// Define option flag(--production)
var isProduction = (argv.production);
// Default value for conditions
var defaultVal = true;

// ---------- File Paths ----------

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
    dest: config.dist + '/images'
  },
  scripts: {
    src: config.dev +  '/scripts/**',
    dest: config.dist + '/scripts'
  },
  styles: {
    main: {
      src: config.dev +  '/styles/main/**',
      dest: config.dist + '/styles'
    },
    vendor: {
      src: config.dev +  '/styles/vendor/**',
      dest: config.dist + '/styles'
    }
  },
  concat: [
    'app/scripts/_init.js',
    'app/scripts/first.js',
    'app/scripts/second.js'
  ],
  bower: [
    'bower_components/modernizr/modernizr.js',
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/foundation/js/foundation.min.js'
  ]
};

// ---------- Tasks ----------

// Clean up the build directory
gulp.task('clean:server', function() {
  return gulp.src(config.dist + '/*', { read: false })
    .pipe(rimraf({ force: true }));
});

// CSScomb plugin for Gulp.js.
// https://github.com/koistya/gulp-csscomb
gulp.task('csscomb', function() {
  return gulp.src(paths.styles.main.src + '/*.scss')
    .pipe($.csscomb())
    .pipe(gulp.dest(config.dev + '/styles/main'));
});

// Compile Sass to CSS using Compass
// https://www.npmjs.com/package/gulp-compass
gulp.task('compass:main', function() {
  if(isProduction){
    defaultVal = false;
  }
  return gulp.src(paths.styles.main.src + '/*.scss')
    .pipe($.plumber())
    .pipe($.compass({
      config_file: './config.rb',
      css: 'build/styles',
      sass: 'app/styles/main',
      style: (isProduction ? 'compressed' : 'nested'),
      comments: defaultVal,
      sourcemap: defaultVal
    }))
    .pipe(gulp.dest(paths.styles.main.dest));
});

// Compile Sass to CSS using Compass
// https://www.npmjs.com/package/gulp-compass
gulp.task('compass:vendor', function() {
  if(isProduction){
    defaultVal = false;
  }
  return gulp.src(paths.styles.vendor.src + '/*.scss')
    .pipe($.plumber())
    .pipe($.compass({
      config_file: './config.rb',
      css: 'build/styles',
      sass: 'app/styles/vendor',
      style: (isProduction ? 'compressed' : 'nested'),
      comments: defaultVal,
      sourcemap: defaultVal
    }))
    .pipe(gulp.dest(paths.styles.vendor.dest))
    .pipe($.livereload());
});

// Gulp task Compass >Autoprefixer
// Run gulp stylish with flag(--production) for distribution ready
gulp.task('stylish', ['compass:main'], function() {
  return gulp.src(paths.styles.main.dest + '/main.css')
    .pipe($.sourcemaps.init())
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe($.if(!isProduction, $.sourcemaps.write('./')))
    .pipe(gulp.dest(paths.styles.main.dest))
    .pipe($.livereload());
});

// Concatenates files
// https://www.npmjs.com/package/gulp-concat
gulp.task('concat', function() {
  return gulp.src(paths.concat)
    .pipe($.sourcemaps.init())
    .pipe($.concat('main.js'))
    .pipe($.if(!isProduction, $.sourcemaps.write('./')))
    .pipe(gulp.dest(paths.scripts.dest));
});

// Gulp task Concat >Uglify
// Run gulp compress with flag(--production) for distribution ready
gulp.task('compress', ['concat'], function() {
  return gulp.src(paths.scripts.dest + '/*.js')
    .pipe($.plumber())
    .pipe($.if(isProduction, $.uglify({
      compress: {
        drop_console: true
      }
    })))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe($.livereload());
});

// Copies required bower_components
gulp.task('copy:bower', function() {
  return gulp.src(paths.bower)
    .pipe(gulp.dest(config.dist + '/bower_components'));
});

// Copies everything in the app/fonts folder
gulp.task('copy:fonts', function() {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest));
});

// Copies everything in the app/images folder
gulp.task('copy:images', function() {
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest));
});

// Copies all .html in the app folder
gulp.task('copy:template', function() {
  return gulp.src(config.dev + '/*.html')
    .pipe(gulp.dest(config.dist));
});

// Gulp task copy:images >imagemin
// Run gulp duplicate with flag(--production)
gulp.task('duplicate:images', ['copy:images'], function() {
  return gulp.src(paths.images.src + '/*.{png,jpg,gif,svg}')
    .pipe($.if(isProduction, $.imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}]
    })))
    .pipe(gulp.dest(paths.images.dest))
    .pipe($.livereload());
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
    .pipe($.livereload());
});

// Gulp plugin to run a local webserver with LiveReload
// https://www.npmjs.com/package/gulp-webserver
gulp.task('server', function() {
  return gulp.src(config.dist)
    .pipe($.webserver({
      port: 8000,
      host: 'localhost',
      fallback: 'index.html',
      livereload: true,
      open: true,
      proxies: {
        options: {
          headers: {
            'Content-Type': 'application/javascript'
          }
        }
      }
    }));
});

// Watch, that actually is an endless stream
// https://www.npmjs.com/package/gulp-watch
gulp.task('watch', function () {
  $.livereload.listen();
  gulp.watch(paths.styles.vendor.src + '/*.scss', ['compass:vendor']);
  gulp.watch(paths.styles.main.src + '/*.scss', ['stylish']);
  gulp.watch(paths.scripts.src + '/*.js', ['compress']);
  gulp.watch(paths.images.src + '/*.{png,jpg,gif,svg}', ['duplicate:images']);
  gulp.watch(config.dev + '/*.html', ['duplicate:html']);
});

// ---------- Custom Tasks ----------

// Dev task
gulp.task('dev', ['clean:server'], function() {
  // runSequence('');
});
// Serve task
gulp.task('serve', function() {
  var launchApp = runSequence('server', 'watch');
  setTimeout(launchApp, 1500);
});
// Build task with flag(--production)
gulp.task('build', ['clean:server'], function() {
  runSequence('csscomb', 'compass:vendor', 'stylish', 'compress', 'copy:bower', 'copy:fonts', 'duplicate:images', 'duplicate:html');
});
// Default task
gulp.task('default', ['clean:server'], function() {
  runSequence('csscomb', 'compass:vendor', 'stylish', 'compress', 'copy:bower', 'copy:fonts', 'duplicate:images', 'duplicate:html', 'serve');
});
