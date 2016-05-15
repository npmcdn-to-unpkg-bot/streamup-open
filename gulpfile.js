var elixir = require('laravel-elixir');
elixir(function(mix) {
    // mix.sass('app.scss');
    mix.sass('_notification.scss');
    // mix.phpUnit();
});

 var  gulp = require('gulp'),
 autoprefix = require('gulp-autoprefixer'),
 minifyCSS = require('gulp-minify-css'),
 concat = require('gulp-concat'),
 changed = require('gulp-changed'),
 stripDebug = require('gulp-strip-debug'),
 uglify = require('gulp-uglify'),
 jshint     = require('gulp-jshint'),
 cssnano = require('gulp-cssnano'),



 // sprite = require('gulp-sprite-generator'),

 ngAnnotate = require('gulp-ng-annotate'),//for adding what i messed
 sourcemaps = require('gulp-sourcemaps'),
 gulp = require('gulp'),
 gutil = require('gulp-util'),
 browserSync = require('browser-sync').create(),
 runSequence = require('run-sequence'),
 uglify = require('gulp-uglify'),
 gulpIf = require('gulp-if'),
 useref = require('gulp-useref'),
 // ngmin = require('gulp-ngmin'),

input  = {
      'html': './App/views/*.html',
      'javascript':  './App/src/**/*.js'
    },

    output = {
      'html': './build/html',
      'stylesheets': 'dist/css',
      'javascript': './App/build/scripts'
    };
gulp.task('browserSync', function() {
      browserSync.init({
        server: {
          baseDir: 'StrimUp.com'//put your own folder name here
        },
      })
});
gulp.task('useref', function(){
  return gulp.src('/resources/views/users/home.blade.php')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('public/build/html'))
});
gulp.task('welcome',function(){
    gulp.src([
              './App/bower_resources/bootstrap/dist/css/bootstrap.min.css',
              './css/custom/*.css',
              './css/AdminLTE.css',
              './css/scroll.css',
              './css/AdminLTE.min.css',
              './css/notification.css',
              './css/register.css'
             ])
    .pipe(concat('welcome.min.css'))
    .pipe(gulp.dest('./build/styles/'));
});

gulp.task('angular', function(){
    gulp.src(
          [

            './App/bower_resources/angular/angular.min.js',
            // './lib/ionic/js/ionic.bundle.min.js',
            // './lib/ionic/js/ionic.material.min.js',
            './App/bower_resources/angular-animate/angular-animate.min.js',
            './App/bower_resources/angular-route/angular-route.min.js',
            './App/bower_resources/angular-aria/angular-aria.min.js',
            './App/bower_resources/angular-messages/angular-messages.min.js',
            './App/lib/ionic/js/svg-assets-cache.js',
            './App/bower_resources/angular-material/angular-material.min.js',

            './App/bower_resources/angular-bootstrap/ui-bootstrap-tpls.min.js',

            './App/bower_resources/angular-bootstrap/ui-bootstrap-tpls.js',
            './App/bower_resources/ng-dialog/js/ngDialog.min.js',
            './App/bower_resources/jquery/dist/jquery.min.js',
            './App/bower_resources/bootstrap/dist/js/bootstrap.min.js',

            './App/bower_resources/Caret.js/dist/jquery.caret.js',
            './App/bower_resources/jquery.atwho/dist/js/jquery.atwho.min.js',
            './App/bower_resources/bootstrap/dist/js/bootstrap.js',
            './lib/ionic/js/prefixfree.min.js',

            './App/bower_resources/angular-ui-router/release/angular-ui-router.js',
            './App/bower_resources/pdfjs-dist/build/pdf.js',
            './App/bower_resources/angular-pdf-viewer/dist/angular-pdf-viewer.min.js',
            './App/bower_resources/mousetrap/mousetrap.js',
            './App/bower_resources/ng-contextmenu/dist/ng-contextmenu.min.js',
            './App/bower_resources/angular-loading-bar/src/loading-bar.js',
            './App/vendor/bootstrap-tagsinput-angular.min',
            './App/vendor/angular-file-saver.bundle.min.js',
            './App/vendor/jquery-file-download.js',



        ])
    .pipe(concat('angular.js'))
    .pipe(gulp.dest('./App/build/scripts/'));
});
/* run javascript through jshint */
gulp.task('jshint', function() {
  return gulp.src(input.javascript)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('imagemin', function() {
  var imgSrc = './images/**/*',
      imgDst = './build/images';
  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

/* concat javascript files, minify if --type production */
gulp.task('build-js', function() {
  runSequence('angular');

  return gulp.src(input.javascript)
    .pipe(sourcemaps.init())
    .pipe(ngAnnotate())
      .pipe(concat('modules.js'))
      //only uglify if gulp is ran with '--type production'
      .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(output.javascript));
});

gulp.task('watch', function() {
  gulp.watch(input.javascript, ['jshint', 'build-js']);
  // gulp.watch(input.sass, ['build-css']);
  // gulp.watch(input.html, ['copy-html']);
});
gulp.task('default', [ 'jshint', 'build-js', 'watch']);
