(function() {
	angular.module('ttkdApp.studentsService', ['ttkdApp.constants'])
		.factory('StudentsSvc', ['$http', '$q', 'apiHost', function($http, $q, apiHost) {
			return {
				getStudent: function(id) {
					return $http.get(apiHost + '/api/persons/' + id + '/');
				},

				updateStudentInfo: function(id, newInfo) {
					return $http.put(apiHost + '/api/persons/' + id + '/', newInfo);
				},

				updateStudentBelt: function(id, oldPersonBelt, newBeltId) {
					oldPersonBelt['current_belt'] = false;
					oldPersonBelt.belt = oldPersonBelt.belt.id;

					var newBeltPayload = {
						'current_belt': true,
						belt: newBeltId,
						person: id,
						'date_achieved': moment().format('YYYY-MM-DD')
					};

					return $q.all([
						$http.put(apiHost + '/api/person-belt/' + oldPersonBelt.id + '/', oldPersonBelt),
						$http.post(apiHost + '/api/person-belt/', newBeltPayload)
					]);
				},

				updateStudentStripes: function(id, oldStripes, newStripes) {
					
				},

				/* post a picture to the api for a student with the given id */
				changePicture: function(id, picture) {
					var data = {
						upload: picture
					};
					return $http.post(apiHost + '/api/person/' + id + '/picture/', data);
				}
			};
		}]);
})();
