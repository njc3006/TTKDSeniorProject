(function() {
	angular.module('ttkdApp.programsSvc', ['ttkdApp.constants'])
		.factory('ProgramsSvc', ['$http', '$filter', 'apiHost', function($http, $filter, apiHost) {
		return {

			/* Gets every program object */
			getPrograms: function() {
				return $http.get(apiHost + '/api/programs');
			},

			/* gets only programs with active set to true */
			getActivePrograms: function() {
				// construct the API call and save it's promise it returns
				var promise = $http.get(apiHost + '/api/programs');
				// modify the result to only have active classes included by using a filter
				promise.then(function onSuccess(response) {
					var filter = $filter('filter');
	         		response.data = filter(response.data, {'active': true});
	         		return response;				
				}, function onFailure(response) {
					response.data = [];
					return response;
				});
				// return the original promise with our filtered data
				return promise;
			},

			/* get a single program by it's id */
			getProgram: function(id) {
				return $http.get(apiHost + '/api/programs/'+id);
			}
		};
	}]);
})();
