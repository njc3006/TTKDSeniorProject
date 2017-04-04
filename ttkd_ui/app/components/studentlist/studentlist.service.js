(function() {
	function StudentListService($http, apiHost) {
		return {
			getAllActiveStudents: function() {
				return $http.get(apiHost + '/api/people/?active=2');
			},

			getAllInactiveStudents: function() {
				return $http.get(apiHost + '/api/people/?active=3');
			},

			getActiveStudentsFromProgram: function(programId) {
				return $http.get(apiHost + '/api/class-people/?person__active=2&program=' + programId);
			},

			getInactiveStudentsFromProgram: function(programId) {
				return $http.get(apiHost + '/api/class-people/?person__active=3&program=' + programId);
			},

			getCheckinsForDate: function(date) {
				return $http.get(apiHost + '/api/check-ins/?date=' + date);
			},

			getProgramAttendanceRecords: function(programId, date) {
				return $http.get(apiHost + '/api/check-ins/?program=' + programId + '&date=' + date);
			},

			getBeltList: function(){
				return $http.get(apiHost + '/api/belts/');
			}
		};
	}

	angular.module('ttkdApp')
		.factory('StudentListService', ['$http', 'apiHost', StudentListService]);
})();
