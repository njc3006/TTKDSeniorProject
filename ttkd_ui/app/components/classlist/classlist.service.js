(function() {
	function ClassListService($http, apiHost) {
		return {
			getClassList: function(formData) {
				return $http.get(apiHost + '/programs/');
			}
		};
	}

	angular.module('ttkdApp')
		.factory('ClassListSvc', ['$http', 'apiHost', ClassListService]);
})();
