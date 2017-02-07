(function() {
	angular.module('ttkdApp.checkinSvc', ['ttkdApp.constants'])
	.factory('CheckinService', ['$http', 'apiHost', function($http, apiHost) {
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
				}
			};
		}

	]);
		
})();