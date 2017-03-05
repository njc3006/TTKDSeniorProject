(function() {
	function RegistrationService($http, apiHost) {
		return {
			getPartialRegistration: function(registrationId) {
				return $http.get(apiHost + '/api/registrations-partial/' + registrationId + '/');
			},

			getPartialRegistrations: function() {
				return $http.get(apiHost + '/api/registrations-partial/');
			},

			completePartialRegistration: function(registrationId, formData) {
				return $http.put(apiHost + '/api/registrations-partial/' + registrationId + '/', formData);
			},

			registerStudent: function(formData) {
				return $http.post(apiHost + '/api/register/', formData);
			}
		};
	}

	angular.module('ttkdApp.registrationSvc', ['ttkdApp.constants'])
		.factory('RegistrationSvc', ['$http', 'apiHost', RegistrationService]);
})();
