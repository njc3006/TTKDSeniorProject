(function() {
	function ClassListService($http, apiHost) {
		return {
			getClassList: function() {
				return $http.get("http://localhost:8000/api/programs/");
			},

			getAllPeople: function() {
				return $http.get("http://localhost:8000/api/persons/");
			}
		};
	}

	angular.module('ttkdApp')
		.factory('ClassListService', ['$http', 'apiHost', ClassListService]);
})();
