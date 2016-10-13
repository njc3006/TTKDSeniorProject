(function() {
	angular.module('ttkdApp')
		.directive('formFocus', ['$parse', function($parse) {
			return {
        link: function (scope, element, attrs) {
          var model = $parse(attrs.formFocus);
          scope.$watch(model, function(value) {
            if (value === true) {
              element[0].focus();
            }
          });

          element.bind('blur', function() {
						if (model.assign) {
            	scope.$apply(model.assign(scope, false));
						}
          });
        }
    	};
		}]);
})();
