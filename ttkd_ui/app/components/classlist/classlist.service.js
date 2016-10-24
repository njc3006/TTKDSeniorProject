(function() {
	function ClassListService($http, apiHost) {
		return {
			getClassList: function() {
				return $http.get('http://localhost:8000/api/programs/');
			},

			getAllStudents: function() {
				return $http.get('http://localhost:8000/api/students');
			},

			getStudentsFromClass: function(programId) {
				return $http.get('http://localhost:8000/api/students/?program=' + programId);
			},

			getAllCheckedIn: function() {
				return $http.get('http://localhost:8000/api/checked-in/persons');
			},

			getClassAttendanceRecords: function(programId, date) {
				console.log(programId);
				return $http.get('http://localhost:8000/api/check-ins/?program=' + programId + '&date=' + date);
			}
		};
	}

	angular.module('ttkdApp')
		.factory('ClassListService', ['$http', 'apiHost', ClassListService]);
})();
