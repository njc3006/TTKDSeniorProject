(function() {
	function PictureDirectiveController(
		$scope,
		$log,
		StudentsService,
		FileUploader,
		$cookies,
		$uibModal,
		apiHost,
		WebcamService
	) {
		var $ctrl = this;
		var modalInstance = null;
		var pictureUpdatedQueryParam = 0;

		/* initialize the file uploader */
		$ctrl.uploader = new FileUploader({
				url: apiHost + '/api/person/' + $ctrl.studentId + '/picture/',
				autoUpload: true,
				onErrorItem: function (item, response, status, headers) {
					$ctrl.onChangeFailure(response);
				},
				onSuccessItem: function(item, response, status, headers) {
					if (status === 201) {
						StudentsService.getStudentPictureUrl($ctrl.studentId).then(
								function success(response) {
										pictureUpdatedQueryParam++;
										$ctrl.source = apiHost + '/' + response.data['picture_url'] + '?p=' +
												pictureUpdatedQueryParam;

										if ($ctrl.onChangeSuccess) {
											$ctrl.onChangeSuccess(response);
										}
								},
								function failure(error) {
									if ($ctrl.onChangeFailure) {
										$ctrl.onChangeFailure(error);
									}
								}
						);
					}
				},
				headers: {
						Authorization: 'Token ' + $cookies.getObject('Authorization').token
				}
		});

		$scope.openCameraModal = function() {
				$scope.myChannel = {
						video: null // Will reference the video element on success
				};

				modalInstance = $uibModal.open({
						animation: true,
						windowClass: 'webcam-modal',
						ariaDescribedBy: 'modal-body',
						templateUrl: 'components/webcam/webcam.modal.html',
						scope: $scope
				});
		};

		$scope.cancelPicture = function() {
				$scope.imagePreview = false;
				modalInstance.close();
		};

		/*
		* Take a picture from the video and draw it on the canvas.
		* Set the imagePreview flag to true to hide the webcame view and
		* show the preview. */
		$scope.takePicture = function(){
				if($scope.myChannel.video) {
						var canvas = document.querySelector('canvas');
						WebcamService.takeSnapshot($scope.myChannel, canvas, 800, 600);
						$scope.imagePreview = true;
						pictureUpdatedQueryParam++;
				}
		};

		$scope.rotatePicture = function() {
				var canvas = document.querySelector('canvas');
				WebcamService.rotateSnapshot(canvas);
		};

		$scope.uploadCameraPicture = function() {
				var canvas = document.querySelector('canvas');
				WebcamService.uploadPicture($ctrl.uploader, canvas);

				$scope.imagePreview = false;
				modalInstance.close();
		};

		$ctrl.openFileUpload = function () {
				document.getElementById('file-upload').click();
		};

		$scope.$watch('studentId', function(newStudentId) {
      $ctrl.uploader.url = apiHost + '/api/person/' + $ctrl.studentId + '/picture/';
		});
	}

	angular.module('ttkdApp.pictureDir', [
		'ttkdApp.constants',
		'ttkdApp.studentsService',
		'angularFileUpload',
		'ngCookies',
		'webcam'
	]).directive('picture', function() {
			return {
				restrict: 'E',
				templateUrl: 'common/picture/picture.directive.html',
				scope: {
					source: '=',
					style: '=',
					studentId: '=',
					onChangeSuccess: '=',
					onChangeFailure: '='
				},
				bindToController: true,
				controllerAs: '$ctrl',
				controller: [
					'$scope',
					'$log',
					'StudentsSvc',
					'FileUploader',
	        '$cookies',
	        '$uibModal',
	        'apiHost',
	        'WebcamService',
					PictureDirectiveController
				]
			};
		});
})();
