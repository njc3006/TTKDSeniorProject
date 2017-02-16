(function() {
	function PartialsHomeController($scope, RegistrationService) {

	}

	angular.module('ttkdApp.registationCtrl')
		.controller('PartialsHomeCtrl', [
			'$scope',
			'RegistrationSvc',
			PartialsHomeController
		]);
})();
