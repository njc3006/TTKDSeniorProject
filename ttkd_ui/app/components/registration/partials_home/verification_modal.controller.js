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
			if ($scope.verificationPhone === '' && $scope.verificationEmail === '') {
				$scope.incorrectPhoneNumber = true;
				$scope.incorrectEmail = true;
			} else if ($scope.verificationPhone !== '' && $scope.verificationPhone !== undefined) {
				if(
					registration.person['primary_phone'] === $scope.verificationPhone ||
					registration.person['secondary_phone'] === $scope.verificationPhone
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
						hasMatchingEmail = email.email === $scope.verificationEmail;
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

		$scope.verificationPhone = '';
		$scope.verificationEmail = '';
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
