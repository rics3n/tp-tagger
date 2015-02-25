'use strict';

var gulp = require('gulp');

var util = require('util');

var browserSync = require('browser-sync');

var middleware = require('./proxy');

function browserSyncInit(baseDir, files, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === 'example/src' || (util.isArray(baseDir) && baseDir.indexOf('src') !== -1)) {
    routes = {
      '/bower_components': 'bower_components'
    };
  }

  browserSync.instance = browserSync.init(files, {
    startPath: '/',
    server: {
      baseDir: baseDir,
      middleware: middleware,
      routes: routes
    },
    browser: browser
  });

}

gulp.task('serve', ['watch'], function () {
  browserSyncInit([
    '.tmp',
    'example/src',
    'src'
  ], [
    '.tmp/{app,components}/**/*.css',
    'example/src/{app,components}/**/*.js',
    'src/*.js',
    'example/src/assets/images/**/*',
    'example/src/*.html',
    'example/{app,components}/**/*.html'
  ]);
});

gulp.task('serve:dist', ['build:example'], function () {
  browserSyncInit('example/dist');
});
