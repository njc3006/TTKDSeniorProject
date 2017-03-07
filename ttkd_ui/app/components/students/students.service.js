(function() {
	angular.module('ttkdApp.studentsService', ['ttkdApp.constants'])
		.factory('StudentsSvc', ['$http', '$q', 'apiHost', 'ProgramsSvc', function($http, $q, apiHost, ProgramsSvc) {
			return {
				getStudent: function(id) {
					return $http.get(apiHost + '/api/persons/' + id + '/');
				},

				getStudentIdsFromName: function(firstName, lastName) {
					var requestConfig = {
						params: {
							'first_name__contains': firstName
						}
					};

					if (lastName !== undefined) {
						requestConfig.params['last_name__contains'] = lastName;
					}

					return $q(function(resolve, reject) {
						$http.get(apiHost + '/api/persons/', requestConfig).then(
							function success(response) {
								resolve(response.data.map(function(person) {
									return person.id;
								}));
							},
							function failure(error) {
								reject(error);
							}
						);
					});
				},

				updateStudentInfo: function(id, newInfo) {
					return $http.put(apiHost + '/api/persons/' + id + '/', newInfo);
				},

				updateStudentBelt: function(id, newBeltId) {
					var newBeltPayload = {
						belt: newBeltId,
						person: id,
						'date_achieved': moment().format('YYYY-MM-DD')
					};

					return $q.all([
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
						personStripe.stripe = personStripe.stripe.id || personStripe.stripe;

						return $http.put(apiHost + '/api/person-stripes/' + personStripe.id + '/', personStripe);
					});

					return $q.all(updatedPersonStripes.concat(newPersonStripes));
				},

				/* post a picture to the api for a student with the given id */
				changePicture: function(id, picture) {
					var data = {
						upload: picture
					};
					return $http.post(apiHost + '/api/person/' + id + '/picture/', data);
				},

				/* registers a student for a single class */
				registerStudent: function(studentId, programId) {
					var data = {
						'is_partial': false,
						'person': studentId,
						'program': programId
					};

					return $http.post(apiHost + '/api/registrations/', data);
				},

				/* delete a student's registration for a class */
				deleteRegistration: function(registrationId) {
					return $http.delete(apiHost + '/api/registrations/'+registrationId+'/');
				},

				/*
				 * Get student registrations and transform them to have program names and ids
				 * response data will be formatted as: [{id: 0, name:""}] */
				getStudentRegistrations: function(id) {
					/* first get a list of all programs */
					var programs = {};
			    return ProgramsSvc.getPrograms().then(
			      function (response) {
			        // create a dictionary mapping each program id to it's name
			        angular.forEach(response.data, function(program) {
			          programs[program.id] = program;
			        });

			        // start the call to get student registrations from in here so our program list is populated
			        return $http.get(apiHost + '/api/registrations/?person='+id).then(
			          function(response) {
			          	/* map each registration object to an id and a readable program name */
			            response.data = response.data.map(function(registration){
			              return {
			              	programId: registration.program,
			              	name: programs[registration.program].name,
											active: programs[registration.program].active,
			              	registrationId: registration.id
			              };
			            });
			            return response;
			          },
			          function(response) {// on error
			          	return response;
			          }
			        );

			      });
				}

			};
		}]);
})();
