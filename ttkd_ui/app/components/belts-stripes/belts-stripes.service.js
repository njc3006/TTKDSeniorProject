(function() {
	function BeltsStripesService($http, apiHost) {
		return {

			getBeltList: function(){
				return $http.get(apiHost + '/api/belts/');
			},

			addNewBelt: function(belt){
				return $http.post(apiHost + '/api/belts/', belt);
			},

			getStripeList: function(){
				return $http.get(apiHost + '/api/stripes/');
			},

			addNewStripe: function(stripe){
				return $http.post(apiHost + '/api/stripes/', stripe);
			},
		};
	}

	angular.module('ttkdApp')
		.factory('BeltsStripesService', ['$http', 'apiHost', BeltsStripesService]);
})();
