(function() {
	function RegistrationService($http, apiHost) {
		return {
			getPartialRegistration: function(registrationId) {

			},

			getPartialRegistrations: function() {
				
			},

			registerStudent: function(formData) {
				return $http.post(apiHost + '/api/register/', formData);
			}
		};
	}

	angular.module('ttkdApp.registrationSvc', ['ttkdApp.constants'])
		.factory('RegistrationSvc', ['$http', 'apiHost', RegistrationService]);
})();
