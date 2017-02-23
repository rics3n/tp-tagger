describe('tpTagger directive', () => {
  let $scope, template, controller, ctrlScope, $log;
  beforeEach(() => {
    module('tpTagger');
    module('templates');
    inject(function ($rootScope, $compile, _$log_) {
      $log = _$log_;

      $scope = $rootScope.$new();
      var element = angular.element('<tp-tagger options="options"/>');
      template = $compile(element)($scope);
      $scope.$digest();
      controller = element.controller('tpTagger');

      ctrlScope = element.isolateScope();
    });
  });
  describe('directiveController', ()=>{
    let setError;
    beforeEach(()=>{setError = jasmine.createSpy('setError');});

    it('should set initial scope values', ()=> {
      let arr = [];
      expect(ctrlScope).toBeDefined();
      expect(ctrlScope.hasFocus).toBeFalsy();
      expect(ctrlScope.isSuggestionsVisible).toBeFalsy();
      expect(ctrlScope.suggestions).toEqual(arr);
      expect(ctrlScope.searchTag).toBe('');
      expect(ctrlScope.searching).toBeFalsy();
      expect(ctrlScope.selectedSuggestionIndex).toEqual(-1);
      expect(ctrlScope.uniqueError).toBeFalsy();
      expect(ctrlScope.maxTagLengthError).toBeFalsy();
      expect(ctrlScope.hasError).toBeFalsy();
    });

    describe('$scope.addTag', ()=>{
      afterEach(()=>{
        expect(ctrlScope.searchTag).toEqual('');
      });

      it('should log debug message "tag empty"', ()=>{
        ctrlScope.addTag();
        expect($log.debug.logs[0]).toEqual(['tag empty']);
      });

      describe('if tag length is longer then options maxTagLength', ()=>{
        beforeEach(()=> {
          ctrlScope.options.maxTagLength = 2;
          ctrlScope.addTag('sad');
        });
        it('should log debug message', ()=>{
          expect($log.debug.logs[0]).toEqual(['tag too long']);
        });
        it('should activate "setError" with args "maxTagLengthError" & true', ()=>{
          let errorName = 'maxTagLengthError';
          expect(ctrlScope[errorName]).toBeTruthy();
          expect(ctrlScope.hasError).toBeTruthy();
        });
      });

      describe('if options.uniqueTags selectedLowerTags contains this tag when its lower cased', ()=>{
        beforeEach(()=> {
          let tag = 'testTag';
          ctrlScope.selectedLowerTags.push(tag.toLowerCase());
          ctrlScope.addTag(tag);
        });
        it('should log debug message "tag not unique"', ()=>{
          expect($log.debug.logs[0]).toEqual(['tag not unique']);
        });

        it('should activate "setError" with arg "uniqueError" as truthy', ()=>{
          let errorName = 'uniqueError';
          expect(ctrlScope[errorName]).toBeTruthy();
          expect(ctrlScope.hasError).toBeTruthy();
        });
      });

      describe('if all conditions met', ()=>{
        let tag, spy;
        beforeEach(()=> {
          tag = 'testTag';
          spy = jasmine.createSpy('addFunction');
          ctrlScope.options.addFunction = spy;
          ctrlScope.addTag(tag);
        });

        it('should push tag to selectedTags', ()=>{
          expect(ctrlScope.selectedTags.indexOf(tag)).not.toBe(-1);
        });
        it('should push tag.toLowerCase to selectedLowerTags',()=>{
          expect(ctrlScope.selectedLowerTags.indexOf(tag.toLowerCase())).not.toBe(-1);
        });
        it('should invoke options.addFunction if its set', ()=>{
          expect(spy).toHaveBeenCalled();
        });
      });
    });

    describe('$scope.deleteTag', ()=>{
      let tag, spy;
      beforeEach(()=>{
        tag = 'testTag';
        ctrlScope.addTag(tag);
        ctrlScope.addTag('tag1');
        ctrlScope.addTag('tag2');

        spy = jasmine.createSpy('deleteFunction');
        ctrlScope.options.deleteFunction = spy;
      });

      it('should splice index from array selectedTags', ()=>{
        expect(ctrlScope.selectedTags.length > 0).toBeTruthy();
        ctrlScope.deleteTag(0);
        expect(ctrlScope.selectedTags.indexOf(tag)).toBe(-1);
      });
      it('should splice index from array selectedLowerTags', ()=>{
        expect(ctrlScope.selectedLowerTags.length > 0).toBeTruthy();
        ctrlScope.deleteTag(0);
        expect(ctrlScope.selectedLowerTags.indexOf(tag)).toBe(-1);
      });
      it('should invoke options.deleteFunction if defined', ()=>{
        ctrlScope.deleteTag(0);
        expect(spy).toHaveBeenCalled();
      });
      it('should do something if index is incorrect', ()=> {
        expect(ctrlScope.deleteTag(1337)).toBeFalsy();
      });
    });

    describe('$scope.search', ()=>{
      let callback, spy, obj;
      let error = false;
      beforeEach(()=>{
        let promise = new Promise((resolve, reject) => {setTimeout(() => {error ? reject('error') : resolve('success!');}, 0);});
        obj = {
          callback: function() {
            return promise;
          }
        };
        spyOn(obj, 'callback').and.returnValue(promise);
        ctrlScope.search(obj.callback);
      });
      it('should set searching to true', ()=>{
        expect(ctrlScope.searching).toBeTruthy();
      });
      it('should call callback with selectedTags as arg', ()=>{
        expect(obj.callback).toHaveBeenCalledWith(ctrlScope.selectedTags);
      });

      describe('search function on resolve or reject', ()=>{
        describe('promise is resolved', ()=>{
          beforeEach((done)=>{
            ctrlScope.search(obj.callback).then(res =>{done()}, err=>{done()});
          });
          it('should log debug message "finshed searching"', ()=>{
            expect($log.debug.logs[0]).toEqual(['finished searching']);
          });
          it('should set searching back to false', ()=>{
            expect(ctrlScope.searching).toBeFalsy();
          });
        });
        describe('promise is rejected', ()=>{
          beforeEach((done)=> {
            error = true;
            ctrlScope.search(obj.callback).then(res =>{done()}, err=>{done()});
          });
          it('should log debug message with the reason arg', ()=>{
            expect($log.error.logs[0]).toEqual(['error']);
          });
          it('should set searching back to false', ()=>{
            expect(ctrlScope.searching).toBeFalsy();
          });
        });
      });
    });

    describe('$scope.isActive', ()=>{
      beforeEach(()=>{
        ctrlScope.addTag('tag');
        ctrlScope.selectActive(0);
      });
      it('should return true if index is equal to selectedSuggestionIndex', ()=>{
        expect(ctrlScope.isActive(0)).toBeTruthy();
      });
      it('should return false if index is not equal to selectedSuggestionIndex', ()=>{
        expect(ctrlScope.isActive(9)).toBeFalsy();
      });
    });

    describe('$scope.selectActive', ()=>{
      it('should set selectedSuggestionIndex to the index arg passed to the method', ()=>{
        ctrlScope.addTag('tag');
        ctrlScope.selectActive(0);
        expect(ctrlScope.selectedSuggestionIndex).toEqual(0);
      });
      it('should return false for non existing index', ()=>{
        expect(ctrlScope.selectActive(0)).toBeFalsy();
      });
    });

    describe('$scope.changeInput', ()=>{
      beforeEach(()=>{
        spyOn(ctrlScope, 'resetErrors');
      });
      describe('if searchTags length is longer the options.minChar', () => {
        let expectedFilteredResults = ['Bern', 'Berlin'];
        let unExpectedFilteredResults = ['Bern'];
        beforeEach(()=>{
          ctrlScope.dictionary = ['Bern', 'Berlin', 'Amsterdam', 'Warsaw'];
          ctrlScope.searchTag = 'Be';
          ctrlScope.options.maxResults = 2;
          ctrlScope.options.minChar = 1;
          spyOn(ctrlScope, 'changeSuggestionVisible');
          ctrlScope.changeInput();
          expect(ctrlScope.searchTag.length).toBeGreaterThan(ctrlScope.options.minChar);
        });
        it('should set return subset of items from $scope.dictionary when searching with searchTag', ()=>{
          expect(ctrlScope.suggestions).toEqual(expectedFilteredResults);
          expect(ctrlScope.suggestions).not.toEqual(unExpectedFilteredResults);
        });
        it('should leave only the amount of $scope.suggestions set in options.maxResults', ()=>{
          expect(ctrlScope.suggestions.length).toEqual(ctrlScope.options.maxResults);
          expect(ctrlScope.suggestions.length).not.toBeGreaterThan(ctrlScope.options.maxResults);
          expect(ctrlScope.options.maxResults).not.toBeGreaterThan(ctrlScope.suggestions.length);
        });
        it('should call changeSuggestionVisible with true if there are more then 1 suggestion', ()=>{
          expect(ctrlScope.changeSuggestionVisible).toHaveBeenCalledWith(true);
        });
        it('should call changeSuggestionVisible with false if there are less then 1 suggestion', ()=>{
          ctrlScope.searchTag = 'Ed';
          ctrlScope.changeInput();
          expect(ctrlScope.changeSuggestionVisible).toHaveBeenCalledWith(false);
        });
        it('should call resetErrors function', ()=>{
          expect(ctrlScope.resetErrors).toHaveBeenCalled();
        });
      });
      describe('else', ()=>{
        beforeEach(()=>{
          ctrlScope.searchTag = 'a';
          ctrlScope.options.minChar = 3;
          spyOn(ctrlScope, 'changeSuggestionVisible');
          ctrlScope.changeInput();
        });
        it('search term should contain less letters than options.minChar', ()=>{
          expect(ctrlScope.options.minChar).toBeGreaterThan(ctrlScope.searchTag.length);
        });
        it('should call changeSuggestionVisible with false if isSuggestionsVisible is true', ()=>{
          if (ctrlScope.isSuggestionsVisible)
            expect(ctrlScope.changeSuggestionVisible).toHaveBeenCalledWith(false);
          else {
            expect(ctrlScope.changeSuggestionVisible).not.toHaveBeenCalledWith(false);
          }
        });
        it('should call resetErrors function', ()=>{
          expect(ctrlScope.resetErrors).toHaveBeenCalled();
        });
      });
    });

    describe('$scope.changeSuggestionVisible', ()=>{
      it('should set isSuggestionsVisible to true if received argument true', ()=>{
        ctrlScope.changeSuggestionVisible(true);
        expect(ctrlScope.isSuggestionsVisible).toBeTruthy();
      });
      describe('if receives argument false', ()=>{
        beforeEach(()=>{
          ctrlScope.changeSuggestionVisible(false);
        });
        it('should set selectedSuggestionIndex to -1',()=>{
          expect(ctrlScope.selectedSuggestionIndex).toEqual(-1);
        });
        it('should set selectedSuggestion to undefined',()=>{
          expect(ctrlScope.selectedSuggestion).toEqual(undefined);
        });
        it('should set isSuggestionsVisible to false',()=>{
          expect(ctrlScope.isSuggestionsVisible).toBeFalsy();
        });
      });
    });
    //
    // describe('$scope.resetErrors', ()=>{
    //
    // });
  });
});
