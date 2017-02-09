(function() {
	function BeltsStripesService($http, apiHost) {
		return {

			getBeltList: function(){
				return $http.get(apiHost + '/api/belts/');
			}
		};
	}

	angular.module('ttkdApp')
		.factory('BeltsStripesService', ['$http', 'apiHost', BeltsStripesService]);
})();
