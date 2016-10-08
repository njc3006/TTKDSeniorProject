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
			var participantSignaturePresent = $scope.registrationInfo.participantSignature !== undefined &&
				$scope.registrationInfo.participantSignature !== '';

			var ageInYears = (new Date()).getFullYear() - $scope.registrationInfo.dob.getFullYear();
			if (ageInYears < 18) {
				var guardianSignaturePresent = $scope.registrationInfo.guardianSignature !== undefined &&
					$scope.registrationInfo.guardianSignature !== '';;

				return participantSignaturePresent && guardianSignaturePresent;
			} else {
				return participantSignaturePresent;
			}
		};

		$scope.phoneNumberPattern = (function() {
			var regexes = [
				/\([0-9]{3}\)-[0-9]{3}-[0-9]{4}/,
				/[0-9]{10}/,
				/[0-9]{3}-[0-9]{3}-[0-9]{4}/
			];

			return {
				test: function(value) {
					return regexes.reduce(function(previousValue, regex) {
						if (previousValue) {
							return previousValue;
						} else {
							return regex.test(value);
						}
					}, false);
				}
			};
		})();

		$scope.onSubmit = function(isValid) {
			if ($scope.currentSelectionIndex < $scope.formSections.length - 1) {
				if (isValid) {
					$scope.selectFormSection($scope.currentSelectionIndex + 1);
				}
			} else {
				if (isValid) {
					console.log($scope.registrationInfo);
				}
			}
		};

		$scope.visitedSections = {};
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
