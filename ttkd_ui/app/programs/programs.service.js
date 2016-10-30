(function() {
	function ProgramsService($http, apiHost) {
		return {
			getPrograms: function() {
				return $http.get(apiHost + '/api/programs');
			},

			getProgram: function(id) {
				return $http.get(apiHost + '/api/programs/'+id);
			}
		};
	}

	angular.module('ttkdApp.programsSvc', ['ttkdApp.constants'])
		.factory('ProgramsSvc', ['$http', 'apiHost', ProgramsService]);
})();
