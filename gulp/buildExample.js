'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('styles', ['wiredep', 'injector:css:preprocessor'], function () {
  return gulp.src(['example/app/index.scss', 'example/app/vendor.scss'])
    .pipe($.sass({style: 'expanded'}))
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe($.autoprefixer())
    .pipe(gulp.dest('.tmp/app/'));
});

gulp.task('injector:css:preprocessor', function () {
  return gulp.src('example/app/index.scss')
    .pipe($.inject(gulp.src([
        'example/{app,components}/**/*.scss',
        '!example/app/index.scss',
        '!example/app/vendor.scss'
      ], {read: false}), {
      transform: function(filePath) {
        filePath = filePath.replace('example/app/', '');
        filePath = filePath.replace('example/components/', '../components/');
        filePath = filePath.replace('src/', '../../src/');
        return '@import \'' + filePath + '\';';
      },
      starttag: '// injector',
      endtag: '// endinjector',
      addRootSlash: false
    }))
    .pipe(gulp.dest('example/app/'));
});

gulp.task('injector:css', ['styles'], function () {
  return gulp.src('example/index.html')
    .pipe($.inject(gulp.src([
        '.tmp/{app,components}/**/*.css',
        '!.tmp/app/vendor.css'
      ], {read: false}), {
      ignorePath: '.tmp',
      addRootSlash: false
    }))
    .pipe(gulp.dest('example/'));
});

gulp.task('scripts', function () {
  return gulp.src('example/{app,components}/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('injector:js', ['scripts', 'injector:css'], function () {
  return gulp.src('example/index.html')
    .pipe($.inject(gulp.src([
      'example/{app,components}/**/*.js',
      '!example/{app,components}/**/*.spec.js',
      '!example/{app,components}/**/*.mock.js'
    ]).pipe($.angularFilesort()), {
      ignorePath: 'example',
      addRootSlash: false
    }))
    .pipe(gulp.dest('example/'));
});

gulp.task('partials', function () {
  return gulp.src(['example/{app,components}/**/*.html', 'src/**/*.html'])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'tp.tagger'
    }))
    .pipe(gulp.dest('.tmp/inject/'));
});

gulp.task('html', ['wiredep', 'injector:css', 'injector:js', 'partials'], function () {
  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  return gulp.src('example/*.html')
    .pipe($.inject(gulp.src('.tmp/inject/templateCacheHtml.js', {read: false}), {
      starttag: '<!-- inject:partials -->',
      ignorePath: '.tmp',
      addRootSlash: false
    }))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(gulp.dest('example_dist'))
    .pipe($.size({ title: 'example_dist', showFiles: true }));
});

gulp.task('images', function () {
  return gulp.src('example/assets/images/**/*')
    .pipe($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('example_dist/assets/images/'));
});

gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('example_dist/fonts/'));
});

gulp.task('misc', function () {
  return gulp.src('example/**/*.ico')
    .pipe(gulp.dest('example_dist/'));
});

gulp.task('build:example', ['html', 'images', 'fonts', 'misc']);
