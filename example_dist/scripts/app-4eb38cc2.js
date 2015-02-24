'use strict';

angular.module('typeahead')
  .controller('MainCtrl', ["$scope", "$log", "$q", function($scope, $log, $q) {
    var search = function(searchValues) {
      $log.info('Executing search with tags: ' + searchValues);
      var deferred = $q.defer();

      setTimeout(function() {

        deferred.resolve();
      }, 1000);

      return deferred.promise;
    };

    var selectedTags = ['Hamburg', 'New York'];
    var selectedTags1 = ['Manila'];
    var selectedTags2 = ['Buxtehude', 'Meppen', 'Berlin'];
    var selectedTags3 = [];

    var dictionary = ['Hamburg', 'Berlin', 'Manila', 'New York', 'Buxtehude'];

    for(var i=0; i<=1000; i++) {
      dictionary.push(chance.city());
    }

    $scope.options = {
      placeholderText: 'Type something...',
      addBtnActive: true,
      searchFunction: search,
      selectedTags: selectedTags,
      dictionary: dictionary
    };

    $scope.optionsSearch = {
      placeholderText: 'Type something...',
      addBtnActive: false,
      selectedTags: selectedTags1,
      searchFunction: search,
      dictionary: dictionary
    };

    $scope.optionsNoSearch = {
      placeholderText: 'Type something...',
      addBtnActive: true,
      selectedTags: selectedTags2,
      dictionary: dictionary
    };

    $scope.optionsNoAdd = {
      placeholderText: 'Type something...',
      addBtnActive: false,
      selectedTags: selectedTags3,
      dictionary: dictionary
    };

    angular.forEach($scope.awesomeThings, function(awesomeThing) {
      awesomeThing.rank = Math.random();
    });
  }]);

'use strict';

angular.module('tpTagger', ['ngAnimate', 'ngTouch', 'ngSanitize', 'tp.tagger']);

angular.module("tp.tagger").run(["$templateCache", function($templateCache) {$templateCache.put("tp_tagger.tpl.html","<div ng-click=\"setFocus = true\"><div class=\"tp-tagger-error-texts\" ng-show=\"hasError\"><span ng-show=\"uniqueError\">{{options.errors.notUniqueTag}}</span></div><div class=\"tp-tagger\"><div class=\"tp-tags-wrapper\"><div class=\"tp-tags\"><span class=\"tp-tag\" ng-repeat=\"tag in selectedTags track by $index\">{{ tag }}<span class=\"delete\" ng-click=\"deleteTag($index)\"><i class=\"fa fa-times\"></i></span></span> <input tp-tagger-input=\"\" ng-change=\"changeInput()\" type=\"text\" class=\"input input-text tp-tag-input\" placeholder=\"{{options.placeholderText}}\" ng-focus=\"hasFocus = true\" ng-blur=\"hasFocus = false\" tp-focus=\"setFocus\" ng-model=\"searchTag\"></div></div><div class=\"tp-btn-wrapper\"><button class=\"btn btn-primary btn-add\" ng-click=\"addTag(searchTag)\" ng-if=\"options.addBtnActive\"><i class=\"fa fa-plus\"></i></button> <button class=\"btn btn-primary btn-search\" ng-click=\"search(options.searchFunction)\" ng-if=\"options.searchFunction\" ng-disabled=\"searching\"><span ng-hide=\"searching\"><i class=\"fa fa-search\"></i></span> <span ng-show=\"searching\"><i class=\"fa fa-spinner fa-pulse\"></i></span></button></div></div><div tp-tagger-popup=\"\"></div></div>");
$templateCache.put("tp_tagger_popup.tpl.html","<div class=\"tp-tagger-suggestions\" ng-show=\"isSuggestionsVisible\"><ul><li ng-repeat=\"suggestion in suggestions\" ng-class=\"{active: isActive($index) }\" ng-mouseenter=\"selectActive($index)\" ng-click=\"addTag($index)\"><div class=\"tp-text\">{{suggestion}}</div><div class=\"tp-break\" ng-if=\"!$last\"></div></li></ul></div>");}]);