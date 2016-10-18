(function() {
	function RegistrationService($http, apiHost) {
		return {
			registerStudent: function(formData) {
				return $http.post(apiHost + '/api/registrations/', formData);
			}
		};
	}

	angular.module('ttkdApp.registrationSvc', [])
		.factory('RegistrationSvc', ['$http', 'apiHost', RegistrationService]);
})();