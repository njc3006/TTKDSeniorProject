(function() {
	'use strict';

	function FormDirectiveController($scope, FormService) {
		$scope.registrationInfo = {};

		$scope.currentSectionFields = [];
		$scope.currentSelectionIndex = 0;

		$scope.onSubmit = function(){};

		$scope.formSections = [
			'Basic Information',
			'Emergency Contacts',
			'Waiver Signature',
			'Review Registration'
		];

		$scope.selectFormSection = function(index) {
			$scope.currentSelectionIndex = index;
			//$scope.currentSectionFields
		};
	}

	FormDirectiveController.$inject = ['$scope', 'FormService'];
  angular.module('ttkdApp.registrationFormDirective', ['formly', 'formlyBootstrap'])
		.directive('registrationForm', function() {
			return {
				restrict: 'E',
				templateUrl: 'registration/form/form.directive.tpl.html',
				scope: {},
				controller: FormDirectiveController
			};
		});
})();
