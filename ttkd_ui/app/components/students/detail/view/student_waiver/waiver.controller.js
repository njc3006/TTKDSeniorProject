(function() {
	function StudentWaiverController($scope, $http, $stateParams, apiHost) {
		$scope.waivers = [];
		$scope.hasWaivers = false;

		var waiversEndpoint = '';

		$scope.getWaivers = function(){
			waiversEndpoint = apiHost + '/api/waivers/?person=' + $stateParams.studentId;

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

		$scope.addWaiver = function(waiver){
			waiversEndpoint = apiHost + '/api/waivers/';

			$http.post(waiversEndpoint, waiver).then(
				function(response){
					console.log("successfully added waiver");

				}, function(error){
					console.log("failed to post");
				});
		};

		$scope.getWaivers();
	}

	angular.module('ttkdApp.studentDetailCtrl')
		.controller('StudentWaiverCtrl', [
			'$scope',
			'$http',
			'$stateParams',
			'apiHost',
			StudentWaiverController
		]);
})();
