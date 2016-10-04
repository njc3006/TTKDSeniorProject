(function() {
	function RegistrationController($scope, FieldsService) {
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
			$scope.currentSectionFields = FieldsService.getForm(indexToId(index));
		};

		$scope.selectFormSection(0);
	}

	RegistrationController.$inject = ['$scope', 'FieldsService'];
	angular.module('ttkdApp')
		.controller('RegistrationController', RegistrationController);
})();
