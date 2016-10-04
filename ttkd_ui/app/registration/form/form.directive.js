(function() {
	'use strict';

	function FormDirectiveController($scope, FormService) {
		function indexToId(index) {
			var id = '';

			switch (index) {
				case 0: id = 'basic_info'; break;
				case 1: id = 'emergency_contacts'; break;
				case 2: id = 'waiver'; break;
				default: id = '';
			}

			return id;
		}

		$scope.registrationInfo = {};

		$scope.onSubmit = function(){};

		$scope.formSections = [
			'Basic Information',
			'Emergency Contacts',
			'Waiver Signature',
			'Review Registration'
		];

		$scope.selectFormSection = function(index) {
			$scope.currentSelectionIndex = index;
			$scope.currentSectionFields = FormService.getForm(indexToId(index));
		};

		$scope.selectFormSection(0);
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
