(function() {
	function FormDirectiveController($scope) {
		$scope.inputs = [{
			name: 'name',
			type: 'text',
			placeholder: 'placeholder'
		}];
	}

	FormDirectiveController.$inject = ['$scope'];
  angular.module('app.directives')
		.directive('registrationForm', function() {
			return {
				restrict: 'E',
				templateUrl: '',
				scope: {},
				controller: FormDirectiveController
			};
		});
})();
