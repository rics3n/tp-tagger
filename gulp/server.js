'use strict';

var gulp = require('gulp');

var util = require('util');

var browserSync = require('browser-sync');

var middleware = require('./proxy');

function browserSyncInit(baseDir, files, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === 'example' || (util.isArray(baseDir) && baseDir.indexOf('example') !== -1)) {
    routes = {
      '/bower_components': 'bower_components',
      '/src': 'src'
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
    'example',
    'src'
  ], [
    '.tmp/{app,components}/**/*.css',
    'example/{app,components}/**/*.js',
    'src/*.js',
    'example/assets/images/**/*',
    'example/*.html',
    'example/{app,components}/**/*.html'
  ]);
});

gulp.task('serve:dist', ['build:example'], function () {
  browserSyncInit('example_dist');
});

gulp.task('serve:e2e', ['wiredep', 'injector:js', 'injector:css'], function () {
  browserSyncInit(['example', '.tmp', 'src'], null, []);
});

gulp.task('serve:e2e-dist', ['build'], function () {
  browserSyncInit('example_dist', null, []);
});
