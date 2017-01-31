(function() {
	function ImportExportService($http, apiHost) {
		return {
			initiateBackup: function() {
				return $http.post(apiHost + '/api/export/');
			},

			importBackup: function(data) {
				return $http.post(apiHost + '/api/import/', data);
			},

			exportAttendance: function(data) {
				return $http.post(apiHost + '/api/csv/attendance', data);
			},

			exportContacts: function() {
				return $http.get(apiHost + '/api/csv/contacts');
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
