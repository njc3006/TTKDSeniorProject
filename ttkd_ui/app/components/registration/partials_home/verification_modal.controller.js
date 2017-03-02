(function functionName() {
	function VerificationModalController(registration, $scope, $state, $uibModalInstance) {
		function removeDashesParensAndSpaces(input) {
			return input
				.replace(new RegExp('-', 'g'), '')
				.replace(new RegExp(' ', 'g'), '')
				.replace(/[{()}]/g, '');
		}

		$scope.cancel = function() {
			$uibModalInstance.close('cancel');
		};

		$scope.authenticateInput = function() {
			//If the input is a Phone Number
			var strippedInput = removeDashesParensAndSpaces($scope.verificationInput);

			if (!isNaN(parseInt(strippedInput))) {
				if(
					registration.person['primary_phone'] === strippedInput ||
					registration.person['secondary_phone'] === strippedInput
				) {
					$state.go('finishPartialRegistration', {registrationId: registration.id});
					$uibModalInstance.close('close');
				} else {
					$scope.incorrectPhoneNumber = true;
				}
			} else {
				var hasMatchingEmail = false;

				registration.person.emails.forEach(function(email) {
					if (!hasMatchingEmail) {
						hasMatchingEmail = email.email === $scope.verificationInput;
					}
				});

				if (hasMatchingEmail) {
					$state.go('finishPartialRegistration', {registrationId: registration.id});
					$uibModalInstance.close('close');
				} else {
					$scope.incorrectEmail = true;
				}
			}
		};

		$scope.verificationInput = '';
	}

	angular.module('ttkdApp.registationCtrl')
		.controller('VerificationModalCtrl', [
			'registration',
			'$scope',
			'$state',
			'$uibModalInstance',
			VerificationModalController
		]);
})();
