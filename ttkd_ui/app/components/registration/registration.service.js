(function() {
	function RegistrationService($http, apiHost) {
		return {
			registerStudent: function(formData) {
				return $http.post(apiHost + '/api/register/', formData);
			}
		};
	}

	angular.module('ttkdApp.registrationSvc', ['ttkdApp.constants'])
		.factory('RegistrationSvc', ['$http', 'apiHost', RegistrationService]);
})();
