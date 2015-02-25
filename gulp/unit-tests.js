'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();


gulp.task('test', function() {
  
  return gulp.src(testFiles)
    .pipe($.karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});
