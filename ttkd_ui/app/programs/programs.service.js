(function() {
	angular.module('ttkdApp.programsSvc', ['ttkdApp.constants'])
		.factory('ProgramsSvc', ['$http', '$filter', 'apiHost', function($http, $filter, apiHost) {
		return {
			getPrograms: function() {
				return $http.get(apiHost + '/api/programs');
			},

			getActivePrograms: function() {
				return $http.get(apiHost + '/api/programs');
			},

			getProgram: function(id) {
				return $http.get(apiHost + '/api/programs/'+id);
			}
		};
	}]);
})();
