'use strict';

angular.module('tpTaggerApp')
  .controller('MainCtrl', function($scope, $log, $q) {
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
  });
