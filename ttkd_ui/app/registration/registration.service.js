(function() {
	function RegistrationService($http, apiHost) {
		return {
			registerStudent: function(formData) {
				$http.post(apiHost + '/registration/create', formData).then(
					function(response) {

					},
					function(error) {
						console.error(error);
					}
				)
			}
		}
	}

	angular.module('ttkdApp')
		.factor('RegistrationSvc', ['$http', 'apiHost', RegistrationService]);
})();
