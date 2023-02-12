// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-02-10 using
// generator-karma 0.8.3

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'node_modules/@bower_components/angular/angular.js',
      'node_modules/@bower_components/angular-mocks/angular-mocks.js',
      'node_modules/@bower_components/angular-animate/angular-animate.js',
      'node_modules/@bower_components/angular-cookies/angular-cookies.js',
      'node_modules/@bower_components/angular-resource/angular-resource.js',
      'node_modules/@bower_components/angular-route/angular-route.js',
      'node_modules/@bower_components/angular-sanitize/angular-sanitize.js',
      'node_modules/@bower_components/angular-touch/angular-touch.js',
      'node_modules/@bower_components/angular-bootstrap/ui-bootstrap.js',
      'node_modules/@bower_components/ng-dialog/js/ngDialog.js',
      'node_modules/@bower_components/ngclipboard/dist/ngclipboard.js',
      'node_modules/@bower_components/angular-loading-bar/src/loading-bar.js',
      'node_modules/@bower_components/lodash/dist/lodash.min.js',
      'app/scripts/**/*.js',
      'tests/frontend_tests/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: ['app/scripts/canvas/**/*.js'],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'Chrome_without_security'
    ],

    // Which plugins to enable
    customLaunchers: {
      Chrome_without_security: {
        base: 'Chrome',
        flags: ['--disable-web-security']
      }
    },

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
