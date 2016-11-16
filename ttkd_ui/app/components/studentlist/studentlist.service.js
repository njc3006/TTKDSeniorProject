(function() {
	function StudentListService($http, $q, apiHost) {
		return {
			getAllStudents: function() {
				return $http.get(apiHost + '/api/people/');
			},

			getStudentsFromClass: function(programId) {
				return $http.get(apiHost + '/api/class-people/?program=' + programId);
			},

			getAllCheckedIn: function() {
				return $http.get(apiHost + '/api/check-ins/');
			},

			getClassAttendanceRecords: function(programId, date) {
				return $http.get(apiHost + '/api/check-ins/?program=' + programId + '&date=' + date);
			},

			getStudentBelt: function(studentId) {
				//current_belt = 2 is the student's current belt
				return $http.get(apiHost + '/api/person-belts/?person=' + studentId + '&current_belt=2');
			},

			getBeltList: function(){
				return $http.get(apiHost + '/api/belts/');
			}
		};
	}

	angular.module('ttkdApp')
		.factory('StudentListService', ['$http', '$q', 'apiHost', StudentListService]);
})();
