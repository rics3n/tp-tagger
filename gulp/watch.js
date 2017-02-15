'use strict';

var gulp = require('gulp');

gulp.task('watch', ['injector:css', 'injector:js'] ,function () {
  gulp.watch('src/{app,components}/**/*.scss', ['injector:css']);
  gulp.watch('src/{app,components}/**/*.js', ['injector:js']);
  gulp.watch('example/{app,components}/**/*.scss', ['injector:css']);
  gulp.watch('example/{app,components}/**/*.js', ['injector:js']);
  gulp.watch('example/assets/images/**/*', ['images']);
});
