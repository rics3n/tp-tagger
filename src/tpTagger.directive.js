'use strict';

/**
 * Created by rucs3n on 2015/01/15.
 */

angular.module('tpTagger', [])
  .directive('tpTagger', function($timeout, $filter, $log) {
    return {
      restrict: 'AE',
      templateUrl: 'tp_tagger.tpl.html',
      scope: {
        options: '='
      },
      controller: function($scope) {
        //SUPPORTED OPTIONS (OPTIONS)
        $scope.options = $scope.options || {};

        //should the user only be able to add a tag once
        $scope.selectedTags = [];
        $scope.selectedLowerTags = [];
        $scope.options.uniqueTags = $scope.options.uniqueTags || true;
       

        $scope.hasFocus = false;
        $scope.isSuggestionsVisible = false;
        $scope.suggestions = [];
        $scope.searching = false;
        $scope.maxChips = $scope.options.maxChips || 5;
        $scope.selectedSuggestionIndex = -1;
        $scope.uniqueError = false;
        $scope.maxTagLengthError = false;
        $scope.hasError = false;
            //Max chips definition
        $scope.maxChips = 5;
        //The keys to separate chips with
        $scope.separatorKeys = [188];

        var setError = function(errorName, state) {
          //it is only possible to show one error
          $scope[errorName] = state;
          $scope.hasError = state;
        };

        $scope.addTag = function(tag) {
          tag = {
            name: tag,
            order: '12'
          }
          if($scope.selectedTags.length == $scope.maxChips-1){
            $log.debug('Max chips amount achieved');
          }
          if(tag.length > $scope.options.maxTagLength) {
            $log.debug('tag too long');
            setError('maxTagLengthError', true);
            return null;
          } else if ($scope.options.uniqueTags && $scope.selectedLowerTags.indexOf(tag.name.toLowerCase()) !== -1) {
            $log.debug('tag not unique');
            setError('uniqueError', true);
            return null;
          } else if(tag === '') {
            $log.debug('tag empty');
            return null;
          } else {
            //add tag
            $scope.selectedTags.push(tag);
            $scope.selectedLowerTags.push(tag.name.toLowerCase());
            if($scope.options.addFunction) {
              $scope.options.addFunction(tag);
            }
            return undefined;
          }
        };

        $scope.deleteTag = function(index) {
          if($scope.options.deleteFunction) {
            $scope.options.deleteFunction(tag);
          }
        };

        //the supplied search method must return a promise to indicate finish of loading
        $scope.search = function(callback) {
          $scope.searching = true;
          callback($scope.selectedTags).then(function() {
            $log.debug('finshed searching');
            $scope.searching = false;
          }, function(reason) {
            $log.error(reason);
            $scope.searching = false;
          });
        };

        $scope.changeSuggestionVisible = function(visible) {
          if (visible) {
            $scope.isSuggestionsVisible = true;
          } else {
            $scope.selectedSuggestionIndex = -1;
            $scope.selectedSuggestion = undefined;
            $scope.isSuggestionsVisible = false;
          }
        };

        $scope.resetErrors = function() {
          if($scope.hasError) {
            $log.debug('reset errors');
            $scope.uniqueError = false;
            $scope.hasError = false;
          }
        };
      },
      link: function(scope) {
        
        
      }
    };
  })
  .directive('tpTaggerPopup', function() {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'tp_tagger_popup.tpl.html'
    };
  });