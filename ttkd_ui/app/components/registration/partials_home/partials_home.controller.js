(function() {
	function PartialsHomeController($scope, $state, RegistrationService) {
		$scope.openPartialRegistration = function(registrationId) {
			$state.go('finishPartialRegistration', {registrationId: registrationId});
		};

		RegistrationService.getPartialRegistrations().then(
			function success(response) {
				$scope.existingPartialRegistrations = response.data;
			},
			function failure(error) {

			}
		);
	}

	angular.module('ttkdApp.registationCtrl')
		.controller('PartialsHomeCtrl', [
			'$scope',
			'$state',
			'RegistrationSvc',
			PartialsHomeController
		]);
})();
