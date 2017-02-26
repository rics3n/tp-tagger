describe('tpTaggerInput directive', ()=>{
  let HOT_KEYS, HOT_KEYS_SUGGESTION, $scope, template, scope, ctrlScope, $log, $compile, $rootScope, element;
  beforeEach(()=>{
    module('tpTagger');
    module('templates');
    inject((_$rootScope_, _$compile_, _$log_)=>{
      HOT_KEYS = [8, 9, 13, 17, 27, 188];
      HOT_KEYS_SUGGESTION = [38, 40];
      $log = _$log_;
      $compile = _$compile_;
      $rootScope = _$rootScope_;

      $scope = $rootScope.$new();
      element = angular.element('<tp-tagger options="options"/>');
      template = $compile(element)($scope);
      $scope.$digest();

      //ctrlScope is the scope used by the controller ONLY, it is not visible outside
      ctrlScope = element.isolateScope();
      //scope is the scope used by THE ENTIRE directive, it would not contain the controller's methods
      scope = element.controller('tpTagger');
    });
  });

  describe('on blur', () => {
    beforeEach(()=>{
      spyOn(ctrlScope, 'addTag');
    });
    it('should add tag if searchTag is greater than 0 and selectedSuggestionIndex is less than 0', ()=>{
      ctrlScope.searchTag = 'test';
      element.find('input').triggerHandler('blur');
      expect(ctrlScope.addTag).toHaveBeenCalledWith(ctrlScope.searchTag);
    });
    it('should add tag from suggestions if selectedSuggestionIndex is greater than 0', ()=>{
      ctrlScope.searchTag = 'B';
      ctrlScope.selectedSuggestionIndex = 0;
      ctrlScope.suggestions = [{name: 'Berlin'}, {name: 'Amsterdam'}];
      element.find('input').triggerHandler('blur');
      expect(ctrlScope.addTag).toHaveBeenCalledWith(ctrlScope.suggestions[0].name);
    });
    it('else it should call resetErrors', ()=>{
      spyOn(ctrlScope, 'resetErrors');
      ctrlScope.searchTag = '';
      element.find('input').triggerHandler('blur');
      expect(ctrlScope.addTag).not.toHaveBeenCalledWith(scope.searchTag);
      expect(ctrlScope.resetErrors).toHaveBeenCalled();
    });
    it('should call changeSuggestionVisible with false, re-setting selectedSuggestionIndex = -1, selectedSuggestion = undefined, isSuggestionsVisible = false',()=>{
      expect(ctrlScope.selectedSuggestionIndex).toEqual(-1);
      expect(ctrlScope.selectedSuggestion).toEqual(undefined);
      expect(ctrlScope.isSuggestionsVisible).toBeFalsy();
    });
  });
  describe('on keydown', () => {
    let event, input;
    function press(key){
      event = new CustomEvent('keydown');
      event.which = key;
      return event;
    }
    beforeEach(()=>{
      input = element.find('input');
    });

    it('preventDefault if mapOfKeyStrokes is not 9-Tab', ()=>{
      let e = press(13);
      spyOn(e, 'preventDefault');
      input.triggerHandler(e);
      expect(e.preventDefault).toHaveBeenCalled();
    });

    describe('if mapOfKeyStrokes is 9/13/188', ()=>{
      it('should addTag from selectedSuggestion.name if selectedSuggestion is true', ()=>{
        let selectedSuggestion = {name: 'Berlin'};
        ctrlScope.selectedSuggestion = selectedSuggestion;
        spyOn(ctrlScope, 'addTag');
        let e = press(9);
        spyOn(e, 'preventDefault');
        input.triggerHandler(e);

        expect(ctrlScope.addTag).toHaveBeenCalledWith(selectedSuggestion.name);
        expect(e.preventDefault).toHaveBeenCalled();
      });
      it('should addTag from searchTag if searchTag.length is greater than 0', ()=>{
        let searchTag = 'test';
        ctrlScope.searchTag = searchTag;
        spyOn(ctrlScope, 'addTag');
        let e = press(9);
        spyOn(e, 'preventDefault');
        input.triggerHandler(e);

        expect(ctrlScope.addTag).toHaveBeenCalledWith(searchTag);
        expect(e.preventDefault).toHaveBeenCalled();
      });
      it('if a search function is provided and at least one tag was added should search & key presses is not 9', ()=>{
        let searchFn = function () {};
        ctrlScope.options.searchFunction = searchFn;
        spyOn(ctrlScope, 'search');
        let e = press(188);
        input.triggerHandler(e);

        expect(ctrlScope.search).toHaveBeenCalledWith(searchFn);
      });
      it('should call changeSuggestionVisible with false, re-setting selectedSuggestionIndex = -1, selectedSuggestion = undefined, isSuggestionsVisible = false',()=>{
        expect(ctrlScope.selectedSuggestionIndex).toEqual(-1);
        expect(ctrlScope.selectedSuggestion).toEqual(undefined);
        expect(ctrlScope.isSuggestionsVisible).toBeFalsy();
      });
    });

    it('if mapOfKeyStrokes is 17/83 should log "Search for tags" and invoke searchFunction passed to options', ()=>{
      let searchFn = function () {};
      ctrlScope.options.searchFunction = searchFn;
      let keyOne = press(17);
      let keyTwo = press(83);
      spyOn(ctrlScope, 'search');
      spyOn(keyOne, 'preventDefault');
      spyOn(keyTwo, 'preventDefault');
      input.triggerHandler(keyOne).triggerHandler(keyTwo);

      expect($log.info.logs[0]).toEqual(['Search for tags']);
      expect(keyOne.preventDefault).toHaveBeenCalled();
      expect(keyTwo.preventDefault).toHaveBeenCalled();
      expect(ctrlScope.search).toHaveBeenCalledWith(searchFn);
    });

    it('if mapOfKeyStrokes is 27 should call changeSuggestionVisible with false and digest scope', ()=>{
      let e = press(27);
      spyOn(ctrlScope, 'changeSuggestionVisible');
      spyOn(ctrlScope, '$digest');
      input.triggerHandler(e);

      expect(ctrlScope.changeSuggestionVisible).toHaveBeenCalledWith(false);
      expect(ctrlScope.$digest).toHaveBeenCalled();
    });

    describe('if mapOfKeyStrokes is 40 & if isSuggestionsVisible is truthy', ()=>{
      beforeEach(()=>{
        ctrlScope.isSuggestionsVisible = true;
      });
      it('should add 1 to selectedSuggestionIndex:: if suggestions.length - 1 is greater than selectedSuggestionIndex AND selectedSuggestionIndex is greater than 0', ()=>{
        ctrlScope.suggestions = ['Berlin', 'Amsterdam', 'Warsaw'];
        ctrlScope.selectedSuggestionIndex = 1;
        let selectedSuggestionIndexPlusOne = ctrlScope.selectedSuggestionIndex + 1;
        let e = press(40);
        spyOn(ctrlScope, 'changeSuggestionVisible');
        spyOn(ctrlScope, '$digest');
        input.triggerHandler(e);

        expect(ctrlScope.selectedSuggestionIndex).toEqual(selectedSuggestionIndexPlusOne);
      });
      it('otherwise should change selectedSuggestionIndex to 0', ()=>{
        ctrlScope.suggestions = ['Berlin'];
        ctrlScope.selectedSuggestionIndex = 1;
        let e = press(40);
        input.triggerHandler(e);
        expect(ctrlScope.selectedSuggestionIndex).toEqual(0);
      });
      it('should set selectedSuggestion to suggestion in scope.suggestions according to index set in selectedSuggestionIndex', ()=>{
        // THIS FUNCTION ADDS +1 TO INDEX AS DEFINED 2 TESTS ABOVE //
        ctrlScope.suggestions = ['Berlin', 'Amsterdam', 'Warsaw'];
        ctrlScope.selectedSuggestionIndex = -1;
        spyOn(ctrlScope, '$digest');
        let e = press(40);
        input.triggerHandler(e);

        expect(ctrlScope.selectedSuggestion).toEqual('Berlin');
        expect(ctrlScope.$digest).toHaveBeenCalled();
      });
    });

    it('if mapOfKeyStrokes is 8 should delete selected tag by index -1 and digest', ()=>{
      ctrlScope.selectedTags = ['Berlin', 'Warsaw']; //length of 2
      let e = press(8);
      spyOn(ctrlScope, 'deleteTag');
      spyOn(ctrlScope, '$digest');
      input.triggerHandler(e);

      expect(ctrlScope.deleteTag).toHaveBeenCalledWith(1);
      expect(ctrlScope.$digest).toHaveBeenCalled();
    });

    describe('if mapOfKeyStrokes is 38 & isSuggestionsVisible is truthy', ()=>{
      beforeEach(()=>{
        ctrlScope.isSuggestionsVisible = true;
      });
      it('if selectedSuggestionIndex is greater than 0, should lower it by one', ()=>{
        let e = press(38);
        ctrlScope.selectedSuggestionIndex = 3;
        input.triggerHandler(e);

        expect(ctrlScope.selectedSuggestionIndex).toEqual(2);
      });

      it('if selectedSuggestionIndex is lower than or equal 0, should set it to suggestions.length -1', ()=>{
        let e = press(38);
        ctrlScope.selectedSuggestionIndex = 0;
        ctrlScope.suggestions = ['Berlin', 'Warsaw', 'Paris', 'Rome']; //length 3, selectedSuggestionIndex will be set to 3
        input.triggerHandler(e);

        expect(ctrlScope.selectedSuggestionIndex).toEqual(3);
      });
      it('should set selectedSuggestion to a suggestion in scope.suggestions according to index set in selectedSuggestionIndex', ()=>{
        // THIS FUNCTION ADDS +1 TO INDEX AS DEFINED 2 TESTS ABOVE //
        ctrlScope.suggestions = ['Berlin', 'Amsterdam', 'Warsaw'];
        ctrlScope.selectedSuggestionIndex = 1;
        spyOn(ctrlScope, '$digest');
        let e = press(38);
        input.triggerHandler(e);

        expect(ctrlScope.selectedSuggestion).toEqual('Berlin');
        expect(ctrlScope.$digest).toHaveBeenCalled();
      });
    });
  });
});