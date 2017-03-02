(function() {
	function reformatObject(object) {
		var reformatted = {};

		for (var field in object) {
			if (object.hasOwnProperty(field)) {
				var camelCased = field.replace(/[\-_\s]+(.)?/g, function(match, chr) {
		      return chr ? chr.toUpperCase() : '';
		    });

				camelCased = camelCased.substr(0, 1).toLowerCase() + camelCased.substr(1);

				reformatted[camelCased] = object[field];
			}
		}

		return reformatted;
	}

	function StudentDetailController($scope, $stateParams, StudentsService, apiHost, FileUploader, SharedDataSvc, $cookies, $uibModal, WebcamService) {
		$scope.apiHost = apiHost;
		var modalInstance;
		$scope.video = null;
		$scope.imagePreview = false;

		/* function to update this student object */
		var updateStudent = function(){
			StudentsService.getStudent($stateParams.studentId).then(
	      function(response) {
						$scope.studentInfo = reformatObject(response.data);

			  SharedDataSvc.setStudentDob($scope.studentInfo.dob);
	          $scope.studentInfo.dob = moment($scope.studentInfo.dob, 'YYYY-MM-DD').toDate();

	          $scope.primaryEmergencyContact   = reformatObject($scope.studentInfo.emergencyContact1);
	          $scope.secondaryEmergencyContact = reformatObject($scope.studentInfo.emergencyContact2);

	          if ($scope.studentInfo.belt) {
	              $scope.beltStyle = getBeltStyle($scope.studentInfo.belt);

	              $scope.earnedStripes = $scope.studentInfo.stripes.filter(function(personStripe) {
	                  return personStripe['current_stripe'];
	              }).map(function(personStripe) {
	                  return personStripe.stripe;
	              });

	              $scope.studentLoaded = true;
	          } else {
	              $scope.studentLoaded = true;
	          }
	      },
        function(error) {
            $scope.studentLoaded = true;

            if (error.status === 404) {
                $scope.studentDoesNotExist = true;
            } else {
                $scope.studentRequestFailed = true;
            }
        });
		};

		/* initialize the file uploader */
		$scope.uploader = new FileUploader({
			url: apiHost + '/api/person/' + $stateParams.studentId + '/picture',
			autoUpload: true,
			onCompleteAll: updateStudent,
			headers: {
				Authorization: 'Token ' + $cookies.getObject('Authorization').token
			}
		});

		function getBeltStyle(belt) {
			var primaryStyle = belt['primary_color'].toLowerCase() === 'ffffff' ?
				'black 8px double' :
				'#' + belt['primary_color'] + ' 8px solid';

				var secondaryStyle = belt['secondary_color'].toLowerCase() === 'ffffff' ?
					'black 8px double' :
					'#' + belt['secondary_color'] + ' 8px solid';

			return {
				'border-right': secondaryStyle,
				'border-left': primaryStyle,
				'border-top': primaryStyle,
				'border-bottom': secondaryStyle
			};
		}

		$scope.currentAge = function() {
			if ($scope.studentInfo === undefined || $scope.studentInfo.dob === undefined) {
				return null;
			}

			var today = moment();
			var birthday = moment($scope.studentInfo.dob);

			return today.diff(birthday, 'years');
		};

		$scope.formattedBirthday = function() {
			if ($scope.studentInfo === undefined || $scope.studentInfo.dob === undefined) {
				return null;
			}

			return moment($scope.studentInfo.dob).format('MM/DD/YYYY');
		};

		$scope.getFormattedEmailList = function() {
			if ($scope.studentInfo === undefined || $scope.studentInfo.emails === undefined) {
				return null;
			}

			return $scope.studentInfo.emails.map(function(email) { return email.email; }).join(', ');
		};

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
			}
		};

		$scope.uploadCameraPicture = function() {
			var canvas = document.querySelector('canvas');
			WebcamService.uploadPicture($scope.uploader, canvas);
			$scope.imagePreview = false;
			modalInstance.close();
		};

		$scope.studentInfo = {};
		$scope.earnedStripes = [];
		$scope.studentBeltClass = '';

		$scope.primaryEmergencyContact = {};
		$scope.secondaryEmergencyContact = {};

		$scope.studentLoaded = false;
		$scope.studentRequestFailed = false;
		$scope.studentDoesNotExist = false;

		updateStudent();

    SharedDataSvc.setStudentId($stateParams.studentId);
	}

	angular.module('ttkdApp.studentDetailCtrl', [
		'ttkdApp.studentsService',
		'ttkdApp.attendanceService',
		'ttkdApp.telLinkDir',
		'ttkdApp.constants',
		'angularFileUpload',
		'ngCookies',
		'webcam'
	]).controller('StudentDetailCtrl', [
			'$scope',
			'$stateParams',
			'StudentsSvc',
			'apiHost',
			'FileUploader',
			'SharedDataSvc',
			'$cookies',
			'$uibModal',
			'WebcamService',
			StudentDetailController
		]);
})();
