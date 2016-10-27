(function() {
	function CheckinService($http, $filter, apiHost) {
		return {
			getStudentsFromClass: function(programId) {
				return $http.get(apiHost + '/api/students/?program=' + programId);
			},
			getCurrentCheckinsForClass: function(programId) {
				return $http.get(apiHost + '/api/check-ins/?program=' + programId +
					'&date=' + $filter('date')(new Date(), 'yyyy-MM-dd'));
			},
			createCheckin: function(data) {
				return $http.post(apiHost + '/api/check-ins/', data);
			}
		};
	}

	angular.module('ttkdApp')
		.factory('CheckinService', ['$http', '$filter', 'apiHost', CheckinService]);
})();