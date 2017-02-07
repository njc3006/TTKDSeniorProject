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

			exportContacts: function(data) {
				return $http.post(apiHost + '/api/csv/contacts', data);
			},

			exportSystem: function() {
				return $http.get(apiHost + '/api/excel/system');
			}
		};
	}

	angular.module('ttkdApp')
		.factory('ImportExportService', ['$http', 'apiHost', ImportExportService]);
})();
