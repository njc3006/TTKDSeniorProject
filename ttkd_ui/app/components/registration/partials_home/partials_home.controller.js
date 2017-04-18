(function() {
	function PartialsHomeController($scope, $rootScope, $state, $stateParams, $uibModal, $document, RegistrationService) {
		$rootScope.showCurrentProgram = $stateParams.showCurrentProgram;

		$scope.openPartialRegistration = function(registrationId, registration) {
			var verificationModalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				controller: 'VerificationModalCtrl',
      	controllerAs: '$ctrl',
				templateUrl: 'components/registration/partials_home/verification_modal.html',
				resolve: {
					registration: function() {
						return registration;
					}
				}
			});
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
			'$rootScope',
			'$state',
			'$stateParams',
			'$uibModal',
			'$document',
			'RegistrationSvc',
			PartialsHomeController
		]);
})();
