(function() {
	function ImportExportService($http, apiHost) {
		return {
			initiateBackup: function() {
				return $http.post(apiHost + '/api/export/');
			},

			importBackup: function(data) {
				return $http.post(apiHost + '/api/import/', data);
			},

			// TODO
			exportAttendance: function() {
				return $http.get(apiHost + '/api/?/');
			},

			// TODO
			exportContacts: function() {
				return $http.get(apiHost + '/api/=?=');
			},

			// TODO
			exportSystem: function() {
				return $http.get(apiHost + '/api/?');
			}
		};
	}

	angular.module('ttkdApp')
		.factory('ImportExportService', ['$http', 'apiHost', ImportExportService]);
})();
