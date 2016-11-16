(function() {
	angular.module('ttkdApp.studentsService', ['ttkdApp.constants'])
		.factory('StudentsSvc', ['$http', '$q', 'apiHost', function($http, $q, apiHost) {
			return {
				getStudent: function(id) {
					return $http.get(apiHost + '/api/persons/' + id + '/');
				},
				convertPersonStripesToStripes: function(personStripes) {
					return $q(function(resolve, reject) {
						var uniqueStripes = {};

						personStripes.forEach(function(personStripe) {
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

								resolve(personStripes.map(function(personStripe) {
									return stripeMap[personStripe.stripe];
								}));
							},
							reject
						);
					});
				},
				getActiveBelt: function(beltId) {
					return $http.get(apiHost + '/api/belts/' + beltId + '/')
				}
			};
		}]);
})();
