// Karma configuration
// Generated on Wed Jul 27 2016 21:37:02 GMT+0200 (CAT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      
      'App/bower_resources/jquery/dist/jquery.min.js',
      'App/bower_resources/angular/angular.js',
      './App/bower_resources/angular-bootstrap/ui-bootstrap-tpls.min.js',

      './App/bower_resources/angular-bootstrap/ui-bootstrap-tpls.js',
      './App/bower_resources/angular-ui-router/release/angular-ui-router.js',
      './App/bower_resources/ngInfiniteScroll/build/ng-infinite-scroll.js',
      './App/bower_resources/angular-animate/angular-animate.min.js',
      './App/bower_resources/angular-route/angular-route.min.js',
      './App/bower_resources/angular-aria/angular-aria.min.js',
      './App/bower_resources/angular-messages/angular-messages.min.js',
     
      './App/bower_resources/mousetrap/mousetrap.js',
      './App/bower_resources/ng-contextmenu/dist/ng-contextmenu.min.js',
      './App/bower_resources/ng-dialog/js/ngDialog.min.js',
      './App/bower_resources/angular-material/angular-material.min.js',
      'App/bower_resources/angular-route/angular-route.js',
      'App/bower_resources/angular-mocks/angular-mocks.js',
       './App/scripts/appConfig.js',
      'App/scripts/**/*.js',
      '__tests__/**/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
