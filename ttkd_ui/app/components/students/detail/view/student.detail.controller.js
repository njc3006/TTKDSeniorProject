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

	function StudentDetailController($scope, $stateParams, StudentsService, apiHost, FileUploader, SharedDataSvc, $cookies, $uibModal, $http, $httpParamSerializerJQLike) {
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
		console.log($scope.uploader);

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
          windowClass: 'checkin-modal',
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'components/webcam/student-picture.modal.html',
          scope: $scope
      });
		};

		$scope.cancelPicture = function() {
			modalInstance.close();
		};

		$scope.takePicture = function(){
			if($scope.myChannel.video) {
				var canvas = document.querySelector('canvas');
				canvas.width = 800;
				canvas.height = 600;
				var context = canvas.getContext('2d');
				context.fillRect(0, 0, canvas.width, canvas.height);
				// Grab the image from the video
				context.drawImage($scope.myChannel.video, 0, 0, canvas.width, canvas.height);
				$scope.imagePreview = true;
			}
		};

		$scope.uploadCameraPicture = function() {
			var canvas = document.querySelector('canvas');
			var dataURL = canvas.toDataURL();


		  var byteString = atob(dataURL.split(',')[1]);

		  // separate out the mime component
		  var mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0]

		  // write the bytes of the string to an ArrayBuffer
		  var ab = new ArrayBuffer(byteString.length);
		  var ia = new Uint8Array(ab);
		  for (var i = 0; i < byteString.length; i++) {
		      ia[i] = byteString.charCodeAt(i);
		  }

		  // write the ArrayBuffer to a blob, and you're done
		  var blob = new Blob([ab], {type: mimeString});
			  
			image = new File([blob], 'upload.png');
			$scope.uploader.addToQueue(image);
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
			'$http',
			'$httpParamSerializerJQLike',
			StudentDetailController
		]);
})();
