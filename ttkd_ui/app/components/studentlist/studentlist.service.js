(function() {
	function StudentListService($http, apiHost) {
		return {
			getAllStudents: function() {
				return $http.get(apiHost + '/api/people/');
			},

			getStudentsFromProgram: function(programId) {
				return $http.get(apiHost + '/api/class-people/?program=' + programId);
			},

			getAllCheckedIn: function() {
				return $http.get(apiHost + '/api/check-ins/');
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
