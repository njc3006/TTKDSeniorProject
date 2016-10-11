(function() {
	function RegistrationService($http, apiHost) {
		return {
			registerStudent: function(formData) {
				return $http.post(apiHost + '/registration/create', formData);
			}
		};
	}

	angular.module('ttkdApp')
		.factory('RegistrationSvc', ['$http', 'apiHost', RegistrationService]);
})();
