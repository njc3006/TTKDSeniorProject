(function() {
	angular.module('ttkdApp.studentsService', ['ttkdApp.constants'])
		.factory('StudentsSvc', ['$http', 'apiHost', function($http, apiHost) {
			return {
				getStudent: function(id) {
					return $http.get(apiHost + '/api/persons/' + id + '/');
				},

				/* post a picture to the api for a student with the given id */
				changePicture: function(id, picture) {
					var data = {
						upload: picture
					}
					return $http.post(apiHost + '/api/person/' + id + '/picture', data);
				}
			};
		}]);
})();
