(function () {
  angular.module('tpTagger')
      .directive('tpTaggerInput', tpTaggerInput);

  function tpTaggerInput($log, $window) {
    //arrows up(38) / down(40), enter(13) and tab(9), esc(27), ctrl(17), s(83)
    var HOT_KEYS = [8, 9, 13, 17, 27, 188];
    var HOT_KEYS_SUGGESTION = [38, 40];
    return {
      restrict: 'A',
      require: '^ngModel',
      link: link
    };

    function link(scope, element) {
      var mapOfKeyStrokes = {};
      element.on('blur', function() {
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
      element.on('keydown', function(evt) {
        mapOfKeyStrokes[evt.which] = evt.type === 'keydown';
        function clearmapOfKeyStrokes(){
          mapOfKeyStrokes = {};
          return;
        }


        //$log.info(evt.which);
        //typeahead is open and an "interesting" key was pressed
        if (!evt) {
          evt = $window.event;
        }
        if ((!scope.isSuggestionsVisible || HOT_KEYS_SUGGESTION.indexOf(evt.which) === -1) && HOT_KEYS.indexOf(evt.which) === -1) {
          if (!(mapOfKeyStrokes[17] && evt.which === 83)) {
            return clearmapOfKeyStrokes();
          }
        } else if (evt.which === 8 && scope.searchTag !== '') {
          return clearmapOfKeyStrokes();
        }
        ///////////////////////////////////////////////////////////////
        //Handlers to keyboard strokes
        ///////////////////////////////////////////////////////////////
        if(!mapOfKeyStrokes[9]) {
          //tab press should be handled by default event
          evt.preventDefault();
        }

        //if enter, tab or comma is pressed add the selected suggestion or the value entered to the
        //selectedTags array
        //if nothing is entered the search function will be executed
        if (mapOfKeyStrokes[13] || mapOfKeyStrokes[9] || mapOfKeyStrokes[188]) {
          if (scope.selectedSuggestion) {
            //add the selected tag
            scope.addTag(scope.selectedSuggestion.name);
            evt.preventDefault();
          } else if (scope.searchTag.length > 0) {
            //add the input
            scope.addTag(scope.searchTag);
            evt.preventDefault();
          } else if (scope.options.searchFunction && !mapOfKeyStrokes[9]) {
            //if a search function is provided and at least one tag was added  -> search
            scope.search(scope.options.searchFunction);
            evt.preventDefault();
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
  }
})();
