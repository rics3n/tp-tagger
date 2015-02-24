'use strict';

angular.module('typeahead')
  .controller('MainCtrl', function($scope, $log, $q) {
    $scope.awesomeThings = [{
      'title': 'AngularJS',
      'url': 'https://angularjs.org/',
      'description': 'HTML enhanced for web apps!',
      'logo': 'angular.png'
    }, {
      'title': 'BrowserSync',
      'url': 'http://browsersync.io/',
      'description': 'Time-saving synchronised browser testing.',
      'logo': 'browsersync.png'
    }, {
      'title': 'GulpJS',
      'url': 'http://gulpjs.com/',
      'description': 'The streaming build system.',
      'logo': 'gulp.png'
    }, {
      'title': 'Jasmine',
      'url': 'http://jasmine.github.io/',
      'description': 'Behavior-Driven JavaScript.',
      'logo': 'jasmine.png'
    }, {
      'title': 'Karma',
      'url': 'http://karma-runner.github.io/',
      'description': 'Spectacular Test Runner for JavaScript.',
      'logo': 'karma.png'
    }, {
      'title': 'Protractor',
      'url': 'https://github.com/angular/protractor',
      'description': 'End to end test framework for AngularJS applications built on top of WebDriverJS.',
      'logo': 'protractor.png'
    }, {
      'title': 'Sass (Node)',
      'url': 'https://github.com/sass/node-sass',
      'description': 'Node.js binding to libsass, the C version of the popular stylesheet preprocessor, Sass.',
      'logo': 'node-sass.png'
    }];

    var search = function(searchValues) {
      $log.info('Executing search with tags: ' + searchValues);
      var deferred = $q.defer();

      setTimeout(function() {

        deferred.resolve();
      }, 1000);

      return deferred.promise;

    }

    var selectedTags = ["Hamburg", "New York"];
    var selectedTags1 = ["Manila"];
    var selectedTags2 = ["Buxtehude", "Meppen", "Berlin"];
    var selectedTags3 = [];

    var dictionary = ["Hamburg", "Berlin", "Manila", "New York", "Buxtehude"];

    for(var i=0; i<=1000; i++) {
      dictionary.push(chance.city());
    }

    $scope.options = {
      placeholderText: 'Type something...',
      addBtnActive: true,
      searchFunction: search,
      selectedTags: selectedTags,
      dictionary: dictionary
    }

    $scope.optionsSearch = {
      placeholderText: 'Type something...',
      addBtnActive: false,
      selectedTags: selectedTags1,
      searchFunction: search,
      dictionary: dictionary
    }

    $scope.optionsNoSearch = {
      placeholderText: 'Type something...',
      addBtnActive: true,
      selectedTags: selectedTags2,
      dictionary: dictionary
    }

    $scope.optionsNoAdd = {
      placeholderText: 'Type something...',
      addBtnActive: false,
      selectedTags: selectedTags3,
      dictionary: dictionary
    }

    angular.forEach($scope.awesomeThings, function(awesomeThing) {
      awesomeThing.rank = Math.random();
    });
  });
