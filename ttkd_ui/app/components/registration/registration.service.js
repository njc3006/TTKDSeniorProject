(function() {
	function RegistrationService($http, apiHost) {
		return {
			registerStudent: function(formData) {
				return $http.post(apiHost + '/api/registrations/', formData);
			}
		};
	}

	angular.module('ttkdApp.registrationSvc', ['ttkdApp.constants'])
		.factory('RegistrationSvc', ['$http', 'apiHost', RegistrationService]);
})();
