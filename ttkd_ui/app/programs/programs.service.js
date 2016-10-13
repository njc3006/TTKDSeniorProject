(function() {
	function ProgramsService($http, apiHost) {
		return {
			getPrograms: function() {
				return $http.get(apiHost + '/api/programs');
			}
		};
	}

	angular.module('ttkdApp.programsSvc', ['ttkdApp.constants'])
		.factory('ProgramsSvc', ['$http', 'apiHost', ProgramsService]);
})();
