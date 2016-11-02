(function() {
	angular.module('ttkdApp.studentsService', ['ttkdApp.constants'])
		.factory('StudentsSvc', ['$http', 'apiHost', function($http, apiHost) {
			return {
				getStudent: function(id) {
					return $http.get(apiHost + '/api/students/' + id + '/');
				}
			};
		}]);
})();
