(function () {
  angular.module('tpTagger')
      .directive('tpTagger', tpTagger);

  // tpTagger.$inject = ['$timeout', $filter, $log];
  // directiveController.$inject = ['$scope'];

  function tpTagger($timeout, $filter, $log){
    return {
      restrict: 'AE',
      templateUrl: 'tp_tagger.tpl.html',
      scope: {
        options: '='
      },
      controller: directiveController,
      link: link,
      bindToController: true
    };

    function directiveController($scope) {
      //$scope config
      $scope.hasFocus = false;
      $scope.isSuggestionsVisible = false;
      $scope.suggestions = [];
      $scope.searchTag = '';
      $scope.searching = false;
      $scope.selectedSuggestionIndex = -1;
      $scope.uniqueError = false;
      $scope.maxTagLengthError = false;
      $scope.hasError = false;

      //$scope methods
      $scope.addTag = addTag;
      $scope.deleteTag = deleteTag;
      $scope.search = search;
      $scope.isActive = isActive;
      $scope.selectActive = selectActive;
      $scope.changeInput = changeInput;
      $scope.changeSuggestionVisible = changeSuggestionVisible;
      $scope.resetErrors = resetErrors;
      /////////////////////////////////////////////


      var setError = function(errorName, state) {
        //it is only possible to show one error
        $scope[errorName] = state;
        $scope.hasError = state;
      };

      function addTag(tag) {
        if(tag === '' || tag == undefined) {
          $log.debug('tag empty');
        } else if(tag.length > $scope.options.maxTagLength) {
          $log.debug('tag too long');
          setError('maxTagLengthError', true);
          $scope.searchTag = '';
        } else if ($scope.options.uniqueTags && $scope.selectedLowerTags.indexOf(tag.toLowerCase()) !== -1) {
          $log.debug('tag not unique');
          setError('uniqueError', true);
          $scope.searchTag = '';
        } else {
          //add tag
          $scope.selectedTags.push(tag);
          $scope.selectedLowerTags.push(tag.toLowerCase());
          $scope.searchTag = '';
          if($scope.options.addFunction) {
            $scope.options.addFunction(tag);
          }
        }
      }

      function deleteTag(index) {
        if(!$scope.selectedTags[index] && !$scope.selectedLowerTags[index])
          return false;
        var tag = angular.copy($scope.selectedTags[index]);

        $scope.selectedTags.splice(index, 1);
        $scope.selectedLowerTags.splice(index, 1);

        if($scope.options.deleteFunction) {
          $scope.options.deleteFunction(tag);
        }
      }

      //the supplied search method must return a promise to indicate finish of loading
      function search(callback) {
        $scope.searching = true;
        return callback($scope.selectedTags).then(function() {
          $log.debug('finished searching');
          $scope.searching = false;
          return true;
        }, function(reason) {
          $log.error(reason);
          $scope.searching = false;
          return false;
        });
      }

      function isActive(index) {
        return index === $scope.selectedSuggestionIndex;
      }

      function selectActive(index) {
        if(!$scope.selectedTags[index])
          return false;
        $scope.selectedSuggestionIndex = index;
      }

      function changeInput() {
        //$log.info($scope.searchTag);
        if ($scope.searchTag.length > $scope.options.minChar) {
          $scope.suggestions = $filter('filter')($scope.dictionary, $scope.searchTag) || [];
          $scope.suggestions = $scope.suggestions.slice(0, $scope.options.maxResults);
          //check if suggestions view should be open
          if ($scope.suggestions.length >= 1) {
            $scope.changeSuggestionVisible(true);
          } else {
            $scope.changeSuggestionVisible(false);
          }

          //$scope.$digest();
        } else {
          if ($scope.isSuggestionsVisible) {
            $scope.changeSuggestionVisible(false);
            //scope.$digest();
          }
        }

        $scope.resetErrors();
      }

      function changeSuggestionVisible(visible) {
        if (visible) {
          $scope.isSuggestionsVisible = true;
        } else {
          $scope.selectedSuggestionIndex = -1;
          $scope.selectedSuggestion = undefined;
          $scope.isSuggestionsVisible = false;
        }
      }

      function resetErrors() {
        if($scope.hasError) {
          $log.debug('reset errors');
          $scope.uniqueError = false;
          $scope.hasError = false;
        } else
          return false;
      }
    }

    function link(scope) {
      //SUPPORTED OPTIONS (OPTIONS)
      scope.options = scope.options || {};
      //minimal no of characters that needs to be entered before typeahead kicks-in
      scope.options.minChar = scope.options.minChar || 1;
      scope.options.maxResults = scope.options.maxResults || 10;
      scope.options.maxTagLength = scope.options.maxTagLength || 50;
      //array of preselected Tags
      scope.selectedTags = scope.options.selectedTags || [];
      scope.selectedLowerTags = [];
      //copy lower case version to seperate array
      for(var i=0; i<scope.selectedTags.length; i++) {
        scope.selectedLowerTags.push(scope.selectedTags[i].toLowerCase());
      }
      //array of tag to search for suggestions
      scope.dictionary = scope.options.dictionary || [];
      //should the user only be able to add a tag once
      scope.options.uniqueTags = scope.options.uniqueTags || true;
      //custom error message can be provided
      scope.options.errors = scope.options.errors || {
            notUniqueTag: 'The tag which you tried to add is not unique. You may only add a Tag once.',
            maxTagLength: 'The tag which you tried to add is too long. Only ' + scope.options.maxTagLength + ' characters are allowed.'
          };
    }
  }
})();
