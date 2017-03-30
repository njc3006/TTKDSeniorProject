(function() {
	angular.module('ttkdApp.programsSvc', ['ttkdApp.constants'])
		.factory('ProgramsSvc', ['$http', '$filter', 'apiHost', function($http, $filter, apiHost) {
		return {

			/* Gets every program object */
			getPrograms: function() {
				return $http.get(apiHost + '/api/programs/');
			},

			/* gets only programs with active set to true */
			getActivePrograms: function() {
				// active 1 is unknown, 2 is true, 3 is false
				return $http.get(apiHost + '/api/programs/?active=2');
			},

			/* posts a new program to the api */
			postNewProgram: function(programData) {
				return $http.post(apiHost + '/api/programs/', programData);
			},

			/* updates an existing program */
			updateProgram: function(programData, id) {
				return $http.put(apiHost + '/api/programs/' + id + '/', programData);
			},

			/* get a single program by it's id */
			getProgram: function(id) {
				return $http.get(apiHost + '/api/programs/' + id);
			},

			getPeople: function() {
				return $http.get(apiHost + '/api/person-minimal/');
			},

			getStudent: function(id) {
				return $http.get(apiHost + '/api/person-minimal/' + id + '/');
			},

			getProgramInstructors: function(id) {
				return $http.get(apiHost + '/api/instructors-minimal/?program=' + id);
			},

			updateProgramInstructors: function(data) {
				return $http.post(apiHost + '/api/instructors/', data);
			},

			removeProgramInstructors: function(id) {
				return $http.delete(apiHost + '/api/instructors/' + id + '/');
			},

			getProgramStudents: function(id) {
				return $http.get(apiHost + '/api/registrations-minimal/?program=' + id);
			},

			updateProgramStudents: function(data) {
				return $http.post(apiHost + '/api/registrations/', data);
			},

			removeProgramStudents: function(id) {
				return $http.delete(apiHost + '/api/registrations/' + id + '/');
			}
		};
	}]);
})();