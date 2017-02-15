'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

var browserslist = require('browserslist');


gulp.task('tagger:styles', function () {
  var browsers = browserslist( ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'Safari 6'] );
  console.log(browsers);
  return gulp.src(['src/tp_tagger.scss'])
    .pipe($.sass({style: 'expanded'}))
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe($.autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'Safari 6']
    }))
    .pipe(gulp.dest('.tmp/tp_tagger'));
});

gulp.task('tagger:partials', function () {
  return gulp.src('src/**/*.html')
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('xtemplateCacheHtml.js', {
      module: 'tpTagger'
    }))
    .pipe(gulp.dest('.tmp/tp_tagger'));
});


gulp.task('tagger:js', ['tagger:partials'], function () {
  return gulp.src(['src/**/*.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'))
    .pipe($.ngAnnotate())
    .pipe(gulp.dest('.tmp/tp_tagger'));
});

gulp.task('tagger:concat', ['tagger:js'], function () {
  return gulp.src(['.tmp/tp_tagger/**/*.js'])
    .pipe($.concat('tpTagger.js'))
    .pipe(gulp.dest('.tmp/tp_tagger'));
});

gulp.task('tagger', ['tagger:concat', 'tagger:styles'], function () {
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');

  return gulp.src(['.tmp/tp_tagger/tpTagger.js', '.tmp/tp_tagger/tp_tagger.css'])
    .pipe(jsFilter)
    .pipe(gulp.dest('dist/'))
    .pipe($.uglify())
    .pipe($.rename({
      extname: '.min.js'
    }))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe(gulp.dest('dist/'))
    .pipe($.size({ title: 'dist/', showFiles: true }));
});

gulp.task('build', ['tagger']);
