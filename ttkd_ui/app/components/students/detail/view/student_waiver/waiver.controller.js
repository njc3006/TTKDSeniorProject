(function() {
	function StudentWaiverController($scope, $http, $stateParams, apiHost, FileUploader, SharedDataService) {
		$scope.waivers = [];
		$scope.hasWaivers = false;

		$scope.uploadWaiver = function(waiverId){
			document.getElementById('waiver-upload' + waiverId).click();
        };

		$scope.getWaivers = function(){
			var waiversEndpoint = apiHost + '/api/waivers/?person=' + $stateParams.studentId;
			$scope.waivers = [];

			$http.get(waiversEndpoint).then(
				function(response){
					$scope.waivers = response.data;
					$scope.hasWaivers = ($scope.waivers.length > 0);

					for(var i = 0; i < $scope.waivers.length; i++){

						var waiverUrl = $scope.waivers[i]['waiver_url'];

						// If the waiver_url is not null lets fix the url by adding the api host
						if (waiverUrl !== undefined){
							$scope.waivers[i]['waiver_url'] = apiHost + '/' + $scope.waivers[i]['waiver_url'];
						}

						$scope.waivers[i].formattedDate = 
								moment($scope.waivers[i]['signature_timestamp']).format('MM/DD/YYYY');

						$scope.waivers[i].waiverUploader = new FileUploader({
							url : apiHost + '/api/waiver/' + $scope.waivers[i].id + '/image',
							autoUpload: true
						});

						$scope.waivers[i].waiverUploader.onSuccessItem = function () {
							$scope.getWaivers();
                        };
                        $scope.waivers[i].age = moment($scope.waivers[i]['signature_timestamp']).diff(moment(SharedDataService.getStudentDob()), 'years');
					}

				});
		};

		$scope.getWaivers();
	}

	angular.module('ttkdApp.studentWaiverCtrl', ['angularFileUpload'])
		.controller('StudentWaiverCtrl', [
			'$scope',
			'$http',
			'$stateParams',
			'apiHost',
			'FileUploader',
			'SharedDataSvc',
			StudentWaiverController
		]);
})();
