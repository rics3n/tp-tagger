'use strict';

angular.module('typeahead', ['ngAnimate', 'ngTouch', 'ngSanitize', 'tp.tagger']);

'use strict';

angular.module('typeahead')
  .controller('MainCtrl', ["$scope", "$log", "$q", function($scope, $log, $q) {
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

    var selectedTags = ["Markdown", "Ruby"];
    var selectedTags1 = ["Markdown"];
    var selectedTags2 = ["Markdown", "Test"];
    var selectedTags3 = [];

    var dictionary = ["Text", "Markdown", "HTML", "PHP", "Python",
      "Java", "JavaScript", "Ruby", "VHDL",
      "Verilog", "C#", "C/C++", "test", "tee", "tea", "sea", "towel", "Russel", "rund"
    ];

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
  }]);

angular.module("typeahead").run(["$templateCache", function($templateCache) {$templateCache.put("tp_tagger.tpl.html","<div ng-click=\"setFocus = true\"><div class=\"tp-tagger-error-texts\" ng-show=\"hasError\"><span ng-show=\"uniqueError\">{{options.errors.notUniqueTag}}</span></div><div class=\"tp-tagger\"><div class=\"tp-tags-wrapper\"><div class=\"tp-tags\"><span class=\"tp-tag\" ng-repeat=\"tag in selectedTags track by $index\">{{ tag }}<span class=\"delete\" ng-click=\"deleteTag($index)\"><i class=\"fa fa-times\"></i></span></span> <input tp-tagger-input=\"\" ng-change=\"changeInput()\" type=\"text\" class=\"input input-text tp-tag-input\" placeholder=\"{{options.placeholderText}}\" ng-focus=\"hasFocus = true\" ng-blur=\"hasFocus = false\" tp-focus=\"setFocus\" ng-model=\"searchTag\"></div></div><div class=\"tp-btn-wrapper\"><button class=\"btn btn-primary btn-add\" ng-click=\"addTag(searchTag)\" ng-if=\"options.addBtnActive\"><i class=\"fa fa-plus\"></i></button> <button class=\"btn btn-primary btn-search\" ng-click=\"search(options.searchFunction)\" ng-if=\"options.searchFunction\" ng-disabled=\"searching\"><span ng-hide=\"searching\"><i class=\"fa fa-search\"></i></span> <span ng-show=\"searching\"><i class=\"fa fa-spinner fa-pulse\"></i></span></button></div></div><div tp-tagger-popup=\"\"></div></div>");
$templateCache.put("tp_tagger_popup.tpl.html","<div class=\"tp-tagger-suggestions\" ng-show=\"isSuggestionsVisible\"><ul><li ng-repeat=\"suggestion in suggestions\" ng-class=\"{active: isActive($index) }\" ng-mouseenter=\"selectActive($index)\" ng-click=\"addTag($index)\"><div class=\"tp-text\">{{suggestion}}</div><div class=\"tp-break\" ng-if=\"!$last\"></div></li></ul></div>");}]);