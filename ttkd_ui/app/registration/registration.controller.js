(function() {
	function RegistrationController($scope, RegistrationService, ProgramsService, StateService) {
		$scope.isLegalAdult = function() {
			var ageInYears = (new Date()).getFullYear() - $scope.registrationInfo.dob.getFullYear();

			return ageInYears >= 18;
		};

		$scope.waiverSigned = function() {
			var participantSignaturePresent = $scope.registrationInfo.participantSignature !== undefined &&
				$scope.registrationInfo.participantSignature !== '';

			if (!$scope.isLegalAdult()) {
				var guardianSignaturePresent = $scope.registrationInfo.guardianSignature !== undefined &&
					$scope.registrationInfo.guardianSignature !== '';

				return participantSignaturePresent && guardianSignaturePresent;
			} else {
				return participantSignaturePresent;
			}
		};

		$scope.calendarIsOpen = false;
		$scope.openCalendar = function() {
			$scope.calendarIsOpen = true;
		};

		$scope.onSubmit = function(formIsValid) {
			if (formIsValid) {
				if ($scope.currentSelectionIndex < $scope.formSections.length - 1) {
						$scope.selectFormSection($scope.currentSelectionIndex + 1);
				} else {
					//TODO: build registration payload
					console.log();
				}
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

					return /^[0-9]{10}$/.test(value);
				}
			};
		})();

		$scope.registrationInfo = {};
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
			console.log(response);
			$scope.programs = response.data;
		}, function(error) {
			//TODO: error handling
		});
	}

	RegistrationController.$inject = ['$scope', 'RegistrationSvc', 'ProgramsSvc', 'StateSvc'];
	angular.module('ttkdApp')
		.controller('RegistrationCtrl', RegistrationController);
})();
