(function() {
	function CheckinService($http, apiHost) {
		return {
			getStudentsFromClass: function(programId) {
				return $http.get(apiHost + '/api/registrations-minimal/?program=' + programId + '&person__active=2');
			},

			getCheckinsForClass: function(programId, checkinDate) {
				return $http.get(apiHost + '/api/check-ins/?program=' + programId +
					'&date=' + checkinDate);
			},

			createCheckin: function(data) {
				return $http.post(apiHost + '/api/check-ins/', data);
			},

			deleteCheckin: function(checkinId) {
				return $http.delete(apiHost + '/api/check-ins/' + checkinId + '/');
			},

			getInstructorsForClass: function(programId) {
				return $http.get(apiHost + '/api/instructors-minimal/?program=' + programId);
			},

			getInstructorCheckinsForClass: function(programId, checkinDate) {
				return $http.get(apiHost + '/api/instructor-check-ins/?program=' + programId +
					'&date=' + checkinDate);
			},

			createInstructorCheckin: function(data) {
				return $http.post(apiHost + '/api/instructor-check-ins/', data);
			},

			deleteInstructorCheckin: function(checkinId) {
				return $http.delete(apiHost + '/api/instructor-check-ins/' + checkinId + '/');
			}
		};
	}

	angular.module('ttkdApp')
		.factory('CheckinService', ['$http', 'apiHost', CheckinService]);
})();