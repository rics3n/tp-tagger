(function () {
  angular.module('tpTagger')
      .directive('tpTaggerPopup', function() {
        return {
          restrict: 'A',
          replace: true,
          templateUrl: 'tp_tagger_popup.tpl.html'
        };
      });
})();