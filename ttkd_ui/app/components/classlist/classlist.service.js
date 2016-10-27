(function() {
	function ClassListService($http, apiHost) {
		return {
			getClassList: function() {
				return $http.get(apiHost + '/api/programs/');
			},

			getAllStudents: function() {
				return $http.get(apiHost + '/api/students');
			},

			getStudentsFromClass: function(programId) {
				return $http.get(apiHost + '/api/students/?program=' + programId);
			},

			getAllCheckedIn: function() {
				return $http.get(apiHost + '/api/checked-in/persons');
			},

			getClassAttendenceRecords: function(programId) {
				return $http.get(apiHost + '/api/check-ins/?program=' + programId);
			}
		};
	}

	angular.module('ttkdApp')
		.factory('ClassListService', ['$http', 'apiHost', ClassListService]);
})();
