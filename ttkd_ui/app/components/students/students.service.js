(function() {
	angular.module('ttkdApp.studentsService', ['ttkdApp.constants'])
		.factory('StudentsSvc', ['$http', '$q', 'apiHost', function($http, $q, apiHost) {
			return {
				getStudent: function(id) {
					return $http.get(apiHost + '/api/persons/' + id + '/');
				},

				getStudentByName: function(firstName, lastName) {
					var config = {
						params: {
							'first_name': firstName,
							'last_name': lastName
						}
					};

					return $http.get(apiHost + '/api/persons/', config);
				},

				/* post a picture to the api for a student with the given id */
				changePicture: function(id, picture) {
					var data = {
						upload: picture
					};
					return $http.post(apiHost + '/api/person/' + id + '/picture', data);
				}
			};
		}]);
})();
