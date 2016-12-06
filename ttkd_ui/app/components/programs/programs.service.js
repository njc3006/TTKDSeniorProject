(function() {
	angular.module('ttkdApp.programsSvc', ['ttkdApp.constants'])
		.factory('ProgramsSvc', ['$http', '$filter', 'apiHost', function($http, $filter, apiHost) {
		return {

			/* Gets every program object */
			getPrograms: function() {
				return $http.get(apiHost + '/api/programs/');
			},

			/* gets only programs with active set to true */
			getActivePrograms: function() {
				// active 1 is unknown, 2 is true, 3 is false
				return $http.get(apiHost + '/api/programs/?active=2');
			},

			/* posts a new program to the api */
			postNewProgram: function(programData) {
				return $http.post(apiHost + '/api/programs/', programData);
			},

			/* get a single program by it's id */
			getProgram: function(id) {
				return $http.get(apiHost + '/api/programs/'+id);
			}
		};
	}]);
})();
