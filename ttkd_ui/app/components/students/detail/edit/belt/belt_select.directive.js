(function() {
	function BeltSelectController($scope, $http, apiHost) {
		$http.get(apiHost + '/api/belts/').then(function success(response) {
			$scope.allBelts = response.data;
		}, function failure(error) {
			$scope.requestFlags.loading.failure = true;
		});
	}

	angular.module('ttkdApp.editStudentCtrl')
		.directive('beltSelect', function() {
			return {
				restrict: 'E',
				templateUrl: 'components/students/detail/edit/belt/belt_select.directive.html',
				scope: {
					currentBelt: '=',
					newBelt: '='
				},
				controller: ['$scope', '$http', 'apiHost', BeltSelectController]
			};
		});
})();
