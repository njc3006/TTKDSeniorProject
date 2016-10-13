(function() {
	function ProgramsService($http, apiHost) {
		return {
			getPrograms: function() {
				return $http.get(apiHost + '/api/programs');
			}
		};
	}

	ProgramsService.$inject = ['$http', 'apiHost'];
	angular.module('ttkdApp.programsSvc', ['ttkdApp.constants'])
		.factory('ProgramsSvc', ProgramsService);
})();
