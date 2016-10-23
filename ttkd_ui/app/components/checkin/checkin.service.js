(function() {
	function CheckinService($http, $filter) {
		return {
			getStudentsFromClass: function(programId) {
				return $http.get('http://localhost:8000/api/students/?program=' + programId);
			},
			getCurrentCheckinsForClass: function(programId) {
				return $http.get('http://localhost:8000/api/check-ins/?program=' + programId +
					'&date=' + $filter('date')(new Date(), 'yyyy-MM-dd'));
			},
			createCheckin: function(data) {
				return $http.post('http://localhost:8000/api/check-ins/', data);
			},
			deleteCheckin: function(checkinId) {
				return $http.delete('http://localhost:8000/api/check-ins/' + checkinId + '/');
			}
		};
	}

	angular.module('ttkdApp')
		.factory('CheckinService', ['$http', '$filter', CheckinService]);
})();