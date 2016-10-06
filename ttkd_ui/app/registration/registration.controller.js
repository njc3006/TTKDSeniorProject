(function() {
	function indexToId(index) {
		var id = '';

		switch (index) {
			case 0: id = 'basic_info'; break;
			case 1: id = 'emergency_contacts'; break;
			case 2: id = 'waiver'; break;
			default: id = 'review';
		}

		return id;
	}

	function RegistrationController($scope, FieldsService) {
		$scope.registrationInfo = {
			emails: [
				{
					email: ''
				}
			]
		};

		$scope.onSubmit = function() {
			if ($scope.currentSelectionIndex < $scope.formSections.length - 1) {
				$scope.selectFormSection($scope.currentSelectionIndex + 1);
			} else {
				console.log('SUBMISSION');
			}
		}

		$scope.formSections = [
			'Basic Information',
			'Emergency Contacts',
			'Waiver Signature',
			'Review Registration'
		];

		$scope.visitedSections = {};

		$scope.selectFormSection = function(index) {
			if (index === $scope.formSections.length - 1) {
				$scope.submitText = 'Submit';
			} else {
				$scope.submitText = 'Continue';
			}

			$scope.currentSelectionIndex = index;
			$scope.currentSectionFields = FieldsService.getForm(indexToId(index));

			if (!$scope.visitedSections[index]) {
				$scope.visitedSections[index] = true;
			}
		};

		$scope.selectFormSection(0);
	}

	RegistrationController.$inject = ['$scope', 'FieldsService'];
	angular.module('ttkdApp')
		.controller('RegistrationController', RegistrationController);
})();
