'use strict';

angular.module('tpTaggerApp', ['ngAnimate', 'ngTouch', 'ngSanitize', 'tpTagger']);

'use strict';

angular.module('tpTaggerApp')
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
    var selectedTags2 = ['Buxtehude', 'Buxtehude', 'Berlin'];
    var selectedTags3 = [];

    var dictionary = [{name: 'Hamburg'}, {name: 'Berlin'}, {name: 'Manila'}, {name: 'New York'}, {name: 'San Francisco'}];

    for(var i=0; i<=1000; i++) {
      dictionary.push({name: chance.city()});
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
  }]);
