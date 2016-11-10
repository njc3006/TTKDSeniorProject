(function() {
	angular.module('ttkdApp.studentsService', ['ttkdApp.constants'])
		.factory('StudentsSvc', ['$http', '$q', 'apiHost', function($http, $q, apiHost) {
			return {
				getStudent: function(id) {
					return $http.get(apiHost + '/api/persons/' + id + '/');
				},
				getStudentStripes: function(id) {
					return $q(function(resolve, reject) {
						$http.get(apiHost + '/api/person-stripes/?person=' + id + '&current_stripe=2').then(
							function(personStripeResponse) {
								var uniqueStripes = {};

								personStripeResponse.data.forEach(function(personStripe) {
									if (!uniqueStripes[personStripe.stripe]) {
										uniqueStripes[personStripe.stripe] = true;
									}
								});

								var stripes = [];
								var stripePromises = [];

								angular.forEach(uniqueStripes, function(value, key) {
									stripePromises.push($http.get(apiHost + '/api/stripes/' + key + '/'));
								});

								$q.all(stripePromises).then(
									function(stripeResponses) {
										var stripeMap = {};

										stripeResponses.forEach(function(resp) {
											stripeMap[resp.data.id] = resp.data;
										});

										resolve(personStripeResponse.data.map(function(personStripe) {
											return stripeMap[personStripe.stripe];
										}));
									},
									reject
								);
							},
							reject
						);
					});
				}
			};
		}]);
})();
