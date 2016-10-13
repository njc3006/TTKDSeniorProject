(function() {
	function ClassListService($http, apiHost) {
		return {
			getClassList: function() {
				return $http.get('http://localhost:8000/api/programs/');
			},

			getAllPeople: function() {
				return $http.get('http://localhost:8000/api/persons/');
			},

			getAllStudents: function(programId) {
				return $http.get('http://localhost:8000/api/students/?program=' + programId);
			}
		};
	}

	angular.module('ttkdApp')
		.factory('ClassListService', ['$http', 'apiHost', ClassListService]);
})();
