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

	function RegistrationController($scope, RegistrationService) {
		/*$scope.registrationInfo = {
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
				console.log($scope.registrationInfo);
				//RegistrationService.registerStudent($scope.)
			}
		};

		$scope.formSections = [
			'Basic Information',
			'Emergency Contacts',
			'Waiver Signature',
			'Review Registration'
		];

		$scope.visitedSections = {};*/

		$scope.onSubmit = function(isValid) {
			if ($scope.currentSelectionIndex < $scope.formSections.length - 1) {
				if (isValid) {
					$scope.selectFormSection($scope.currentSelectionIndex + 1);
				}
			} else {
				if (isValid) {
					console.log($scope.registrationInfo);
				}

				//RegistrationService.registerStudent($scope.)
			}
		};

		$scope.registrationInfo = {};

		$scope.formSections = [
			{
				name: 'Basic Information',
				templateUrl: 'registration/basic_info/basic_info.html'
			},
			{
				name: 'Emergency Contacts',
				templateUrl: 'registration/emergency_contacts/emergency_contacts.html'
			},
			{
				name: 'Waiver Signature',
				templateUrl: 'registration/waiver/waiver_sign.html'
			},
			{
				name: 'Review Registration',
				templateUrl: 'registration/review/reviewRegistration.html'
			}
		];

		$scope.selectFormSection = function(index) {
			if (index === $scope.formSections.length - 1) {
				$scope.submitText = 'Submit';
			} else {
				$scope.submitText = 'Continue';
			}

			$scope.currentSelectionIndex = index;
			$scope.currentFormTpl = $scope.formSections[index].templateUrl;
		};

		$scope.currentSelectionIndex = 0;
		$scope.selectFormSection($scope.currentSelectionIndex);
	}

	RegistrationController.$inject = ['$scope', 'RegistrationSvc'];
	angular.module('ttkdApp')
		.controller('RegistrationCtrl', RegistrationController);
})();
