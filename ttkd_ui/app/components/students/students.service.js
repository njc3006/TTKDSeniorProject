(function() {
	angular.module('ttkdApp.studentsService', ['ttkdApp.constants'])
		.factory('StudentsSvc', ['$http', '$q', 'apiHost', function($http, $q, apiHost) {
			return {
				getStudent: function(id) {
					return $q(function(resolve, reject) {
						$http.get(apiHost + '/api/persons/' + id + '/').then(function(response) {
							resolve(response.data);
						}, reject);
					});
				}
			};
		}]);
})();
