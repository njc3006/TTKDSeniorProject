(function() {
	function BeltsStripesService($http, apiHost) {
		return {

			getBeltList: function(){
				return $http.get(apiHost + '/api/belts/');
			},

			addNewBelt: function(belt){
				return $http.post(apiHost + '/api/belts/', belt);
			},

			updateBelt: function(belt){
				return $http.put(apiHost + '/api/belts/' + belt.id + '/', belt);
			},

			getStripeList: function(){
				return $http.get(apiHost + '/api/stripes/');
			},

			addNewStripe: function(stripe){
				return $http.post(apiHost + '/api/stripes/', stripe);
			},

			updateStripe: function(stripe){
				return $http.put(apiHost + '/api/stripes/' + stripe.id + '/', stripe);
			}
		};
	}

	angular.module('ttkdApp')
		.factory('BeltsStripesService', ['$http', 'apiHost', BeltsStripesService]);
})();
