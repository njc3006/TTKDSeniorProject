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

			getClassAttendenceRecords: function(programId) {
				return $http.get('http://localhost:8000/api/check-ins/?program=' + programId);
			}
		};
	}

	angular.module('ttkdApp')
		.factory('ClassListService', ['$http', 'apiHost', ClassListService]);
})();
