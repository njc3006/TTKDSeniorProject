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

	function RegistrationController($scope, RegistrationService, ProgramsService, StateService) {
		$scope.waiverSigned = function() {
			var participantSignaturePresent = $scope.participantSignature !== undefined &&
				$scope.participantSignature !== '';

			var ageInYears = (new Date()).getFullYear() - $scope.dob.getFullYear();
			if (ageInYears < 18) {
				var guardianSignaturePresent = $scope.guardianSignature !== undefined &&
					$scope.guardianSignature !== '';

				return participantSignaturePresent && guardianSignaturePresent;
			} else {
				return participantSignaturePresent;
			}
		};

		$scope.onSubmit = function() {
			if ($scope.currentSelectionIndex < $scope.formSections.length - 1) {
					$scope.selectFormSection($scope.currentSelectionIndex + 1);
			} else {
				//TODO: build registration payload
				console.log();
			}
		};

		$scope.phoneNumberPattern = (function() {
			return {
				test: function(value) {
					//Remove all parentheses, spaces, and dashes ==> normalize the input for validation
					value = value.split(' ').join('');
					value = value.split('(').join('');
					value = value.split(')').join('');
					value = value.split('-').join('');

					return /[0-9]{10}/.test(value);
				}
			};
		})();

		$scope.visitedSections = {};

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

			$scope.visitedSections[index] = true;
		};

		$scope.currentSelectionIndex = 0;
		$scope.selectFormSection($scope.currentSelectionIndex);

		$scope.states = StateService.getStates();
		ProgramsService.getPrograms().then(function(response) {
			$scope.programs = response;
		}, function(error) {
			//TODO: error handling
		});
	}

	RegistrationController.$inject = ['$scope', 'RegistrationSvc', 'ProgramsSvc', 'StateSvc'];
	angular.module('ttkdApp')
		.controller('RegistrationCtrl', RegistrationController);
})();
