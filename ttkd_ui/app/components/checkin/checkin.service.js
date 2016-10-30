(function() {
	function CheckinService($http, apiHost) {
		return {
			getStudentsFromClass: function(programId) {
				return $http.get(apiHost + '/api/students/?program=' + programId);
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
			}
		};
	}

	angular.module('ttkdApp')
		.factory('CheckinService', ['$http', 'apiHost', CheckinService]);
})();