(function() {
	function StudentWaiverController($scope, $http, $q, $stateParams, apiHost, SharedDataService) {
		$scope.waivers = [];
		$scope.hasWaivers = false;

		var waiversEndpoint = '';

		$scope.setEndpoint = function(){
			waiversEndpoint = apiHost + '/api/waivers/?person=' + $stateParams.studentId;
		};

		$scope.getWaivers = function(){
			$scope.setEndpoint();

			$http.get(waiversEndpoint).then(
				function(response){
					$scope.waivers = response.data;
					$scope.hasWaivers = ($scope.waivers.length > 0);

					for(var i = 0; i < $scope.waivers.length; i++){
						$scope.waivers[i].waiver_url = 'C:/Users/Andrew/Desktop/waivers/waiver_' + (i+ 1) + '.png';						
						$scope.waivers[i].formattedDate = moment($scope.waivers[i]['signature_timestamp']).format('MM/DD/YYYY');
					}

				});
		};

		$scope.getWaivers();
	}

	angular.module('ttkdApp.studentDetailCtrl')
		.controller('StudentWaiverCtrl', [
			'$scope',
			'$http',
			'$q',
			'$stateParams',
			'apiHost',
			'SharedDataSvc',
			StudentWaiverController
		]);
})();
