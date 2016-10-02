(function() {
	function FormDirectiveController($scope) {
		$scope.formSections = [
			{
				name: 'Basic Information'
			},
			{
				name: 'Emergency Contact'
			},
			{
				name: 'Student Picture'
			},
			{
				name: 'Waiver Signature'
			},
			{
				name: 'Review Registration'
			}
		];
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
