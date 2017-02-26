module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/angular/angular.js',                             // angular
      'node_modules/angular-mocks/angular-mocks.js',                 // loads our modules for tests
      'src/app.js',
      'src/directives/**.js',
      'src/directives/**.**.js',
      'src/directives/*.html',
      'src/test/*.spec.js'
    ],

    // './src/services/users/users.spec.js',                           //Users service test
    // './src/services/pokemon/pokemon.spec.js',
    // './src/components/users/users.spec.js'                          //Users Comp test
    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      "src/directives/*.html": ["ng-html2js"]
    },
    ngHtml2JsPreprocessor: {
      // If your build process changes the path to your templates,
      // use stripPrefix and prependPrefix to adjust it.

      // my-directive.tpl.html
      // src/directives/my-directive.tpl.html --strip

      // stripPrefix: "src/",
      stripPrefix: "src/directives/",

      // the name of the Angular module to create
      moduleName: "templates"
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


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
    concurrency: Infinity,
    client: {
      captureConsole: true
    }
  })
};