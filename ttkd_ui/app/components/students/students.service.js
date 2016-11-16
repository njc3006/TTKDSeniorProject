(function() {
	angular.module('ttkdApp.studentsService', ['ttkdApp.constants'])
		.factory('StudentsSvc', ['$http', '$q', 'apiHost', function($http, $q, apiHost) {
			return {
				getStudent: function(id) {
					return $http.get(apiHost + '/api/persons/' + id + '/');
				},
				getActiveBelt: function(beltId) {
					return $http.get(apiHost + '/api/belts/' + beltId + '/')
				}
			};
		}]);
})();
