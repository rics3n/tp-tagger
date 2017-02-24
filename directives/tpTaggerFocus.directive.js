(function () {
  angular.module('tpTagger')
    .directive('tpFocus', tpFocus);

  function tpFocus($timeout, $parse) {
    return {
      link: link
    };

    function link(scope, element, attrs) {
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
  }
})();
