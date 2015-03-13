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
        $scope.hasFocus = false;
        $scope.isSuggestionsVisible = false;
        $scope.suggestions = [];
        $scope.searchTag = '';
        $scope.searching = false;
        $scope.selectedSuggestionIndex = -1;
        $scope.uniqueError = false;
        $scope.maxTagLengthError = false;
        $scope.hasError = false;

        var setError = function(errorName, state) {
          //it is only possible to show one error
          $scope[errorName] = state;
          $scope.hasError = state;
        };

        $scope.addTag = function(tag) {
          if(tag.length > $scope.options.maxTagLength) {
            $log.info('tag too long');
            setError('maxTagLengthError', true);
            $scope.searchTag = '';
          } else if ($scope.options.uniqueTags && $scope.selectedLowerTags.indexOf(tag.toLowerCase()) !== -1) {
            $log.info('tag not unique');
            setError('uniqueError', true);
            $scope.searchTag = '';
          } else if(tag === '') {
            $log.info('tag empty');
          } else {
            //add tag
            $scope.selectedTags.push(tag);
            $scope.selectedLowerTags.push(tag.toLowerCase());
            $scope.searchTag = '';
          }
        };

        $scope.deleteTag = function(index) {
          $scope.selectedTags.splice(index, 1);
          $scope.selectedLowerTags.splice(index, 1);
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

        $scope.isActive = function(index) {
          return index === $scope.selectedSuggestionIndex;
        };

        $scope.selectActive = function(index) {
          $scope.selectedSuggestionIndex = index;
        };

        $scope.changeInput = function() {
          $log.info($scope.searchTag);
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
    };
  })
  .directive('tpTaggerInput', function($log, $window) {
    //arrows up(38) / down(40), enter(13) and tab(9), esc(27), ctrl(17), s(83)
    var HOT_KEYS = [8, 9, 13, 17, 27];
    var HOT_KEYS_SUGGESTION = [38, 40];
    return {
      restrict: 'A',
      require: '^ngModel',
      link: function(scope, element) {
        var mapOfKeyStrokes = {};

        element.bind('blur', function() {
          if (scope.searchTag.length > 0 && scope.selectedSuggestionIndex < 0) {
            //add the input
            scope.addTag(scope.searchTag);
          } else if (scope.selectedSuggestionIndex >= 0) {
            scope.addTag(scope.suggestions[scope.selectedSuggestionIndex].name);
          } else {
            scope.resetErrors();
          }

          scope.changeSuggestionVisible(false);
        });

        //bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(27), ctrl(17), s(83), remove(8)
        element.bind('keydown', function(evt) {
          //$log.info(evt.which);
            //typeahead is open and an "interesting" key was pressed
          if ((!scope.isSuggestionsVisible || HOT_KEYS_SUGGESTION.indexOf(evt.which) === -1) && HOT_KEYS.indexOf(evt.which) === -1) {
            if (!(mapOfKeyStrokes[17] && evt.which === 83)) {
              //$log.debug('not important key pressed');
              mapOfKeyStrokes = {};
              return;
            }
          } else if (evt.which === 8 && scope.searchTag !== '') {
            mapOfKeyStrokes = {};
            return;
          }

          evt.preventDefault();

          if (!evt) {
            evt = $window.event;
          }

          mapOfKeyStrokes[evt.which] = evt.type === 'keydown';

          //if enter or tab is pressed add the selected suggestion or the value entered to the
          //selectedTags array
          if (mapOfKeyStrokes[13] || mapOfKeyStrokes[9]) {
            if (scope.selectedSuggestion) {
              //add the selected tag
              scope.addTag(scope.selectedSuggestion.name);
            } else if (scope.searchTag.length > 0) {
              //add the input
              scope.addTag(scope.searchTag);
            } else if (scope.options.searchFunction) {
              //if a search function is provided and at least one tag was added  -> search
              scope.search(scope.options.searchFunction);
            }

            scope.changeSuggestionVisible(false);

            scope.$digest();
            //do nothing if no suggestion is selected or the entered text has not more than 2 characters
            mapOfKeyStrokes = {};
          }

          // if the combination of Ctrl + s is pressed execute a search
          else if (mapOfKeyStrokes[17] && mapOfKeyStrokes[83]) {
            $log.info('Search for tags');
            evt.preventDefault();
            if (scope.options.searchFunction) {
              scope.search(scope.options.searchFunction);
            }
            mapOfKeyStrokes = {};
          }

          //if escape is pressed close the suggestion view and set selected suggestion to undefined
          else if (mapOfKeyStrokes[27]) {
            scope.changeSuggestionVisible(false);
            scope.$digest();
            mapOfKeyStrokes = {};
          } else if (mapOfKeyStrokes[40]) { //arrow down -> typeahead selected one down
            if (scope.isSuggestionsVisible) {
              if (scope.selectedSuggestionIndex < scope.suggestions.length - 1 && scope.selectedSuggestionIndex >= 0) {
                scope.selectedSuggestionIndex = scope.selectedSuggestionIndex + 1;
              } else {
                scope.selectedSuggestionIndex = 0;
              }

              scope.selectedSuggestion = scope.suggestions[scope.selectedSuggestionIndex];
              scope.$digest();
            }

            mapOfKeyStrokes = {};
          } else if (mapOfKeyStrokes[8] && scope.searchTag === '' && scope.selectedTags.length > 0) {
            scope.deleteTag(scope.selectedTags.length - 1);
            mapOfKeyStrokes = {};
            scope.$digest();
          } else if (mapOfKeyStrokes[38]) { //arrow up -> set typeahead selected on up
            if (scope.isSuggestionsVisible) {
              if (scope.selectedSuggestionIndex > 0) {
                scope.selectedSuggestionIndex = scope.selectedSuggestionIndex - 1;
              } else {
                scope.selectedSuggestionIndex = scope.suggestions.length - 1;
              }

              scope.selectedSuggestion = scope.suggestions[scope.selectedSuggestionIndex];
              scope.$digest();
            }

            mapOfKeyStrokes = {};
          } else {
            if (!mapOfKeyStrokes[17]) {
              mapOfKeyStrokes = {};
            }
          }
        });
      }
    };
  })
  .directive('tpTaggerPopup', function() {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'tp_tagger_popup.tpl.html'
    };
  }).directive('tpFocus', function($timeout, $parse) {
    return {
      link: function(scope, element, attrs) {
        var model = $parse(attrs.tpFocus);
        scope.$watch(model, function(value) {
          if (value === true) {
            $timeout(function() {
              element[0].focus();
            });
          }
        });
        element.bind('blur', function() {
          scope.$apply(model.assign(scope, false));
        });
      }
    };
  });
