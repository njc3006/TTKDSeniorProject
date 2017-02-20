(function() {
	function RegistrationService($http, apiHost) {
		return {
			getPartialRegistration: function(registrationId) {
				return $http.get(apiHost + '/api/registrations-partial/' + registrationId + '/');
			},

			getPartialRegistrations: function() {
				return $http.get(apiHost + '/api/registrations-partial/');
			},

			registerStudent: function(formData) {
				return $http.post(apiHost + '/api/register/', formData);
			}
		};
	}

	angular.module('ttkdApp.registrationSvc', ['ttkdApp.constants'])
		.factory('RegistrationSvc', ['$http', 'apiHost', RegistrationService]);
})();
