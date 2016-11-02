(function() {
	function StudentListService($http, apiHost) {
		return {
			getClassList: function() {
				return $http.get(apiHost + '/api/programs/');
			},

			getAllStudents: function() {
				return $http.get(apiHost + '/api/students/');
			},

			getStudentsFromClass: function(programId) {
				return $http.get(apiHost + '/api/students/?program=' + programId);
			},

			getAllCheckedIn: function() {
				return $http.get(apiHost + '/api/checked-in/persons/');
			},

			getClassAttendanceRecords: function(programId, date) {
				console.log(programId);
				return $http.get(apiHost + '/api/check-ins/?program=' + programId + '&date=' + date);
			}
		};
	}

	angular.module('ttkdApp')
		.factory('StudentListService', ['$http', 'apiHost', StudentListService]);
})();
