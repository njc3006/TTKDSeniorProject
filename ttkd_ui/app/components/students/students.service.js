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

					console.log(newBeltId);
					var newBeltPayload = {
						'current_belt': true,
						belt: newBeltId,
						person: id,
						'date_achieved': moment().format('YYYY-MM-DD')
					};

					return $q.all([
						$http.put(apiHost + '/api/person-belts/' + oldPersonBelt.id + '/', oldPersonBelt),
						$http.post(apiHost + '/api/person-belts/', newBeltPayload)
					]);
				},

				updateStudentStripes: function(id, oldPersonStripes, newStripes) {
					var newPersonStripes = newStripes.map(function(stripe) {
						return $http.post(apiHost + '/api/person-stripes/', {
							'current_stripe': true,
							person: id,
							stripe: stripe.id,
							'date_achieved': moment().format('YYYY-MM-DD')
						});
					});

					var updatedPersonStripes = oldPersonStripes.map(function(personStripe) {
						personStripe['current_stripe'] = false;
						personStripe.stripe = personStripe.stripe.id;

						return $http.put(apiHost + '/api/person-stripes/' + personStripe.id + '/', personStripe);
					});

					return $q.all(newPersonStripes.concat(updatedPersonStripes));
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
