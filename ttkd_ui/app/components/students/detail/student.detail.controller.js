(function() {
	function StudentDetailController($scope, $stateParams, StudentsService) {
		$scope.notYetImplemented = function() {
			alert('This feature has not yet been implemented')
		};

		$scope.formatPhoneNumber = function(phone) {
			if (phone === undefined) {
				return null;
			}

			return '(' + phone.substring(0, 3) + ') ' + phone.substring(3, 6) + '-' + phone.substring(6);
		};

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

			var formattedMonth = $scope.studentInfo.dob.getMonth() < 9 ?
				'0' + ($scope.studentInfo.dob.getMonth() + 1) :
				($scope.studentInfo.dob.getMonth() + 1);

			var formattedDate = $scope.studentInfo.dob.getDate() < 10 ?
				'0' + $scope.studentInfo.dob.getDate() :
				$scope.studentInfo.dob.getDate();

			return formattedMonth + '/' + formattedDate + '/' + $scope.studentInfo.dob.getFullYear();
		};

		$scope.studentInfo = {};
		$scope.primaryEmergencyContact = {};
		$scope.secondaryEmergencyContact = {};
		$scope.studentRequestFailed = false;

		StudentsService.getStudent($stateParams.studentId).then(function(response) {
			$scope.studentInfo = response.data.person;

			$scope.studentInfo.picture = 'http://placehold.it/350x350';
			$scope.studentInfo.dob = new Date($scope.studentInfo.dob);

			$scope.primaryEmergencyContact   = $scope.studentInfo.emergency_contacts[0];
			$scope.secondaryEmergencyContact = $scope.studentInfo.emergency_contacts[1];
		}, function(error) {
			console.error(error);
			$scope.studentRequestFailed = true;
		});
	}

	angular.module('ttkdApp.studentDetailController', ['ttkdApp.studentsService'])
		.controller('StudentDetailCtrl', [
			'$scope',
			'$stateParams',
			'StudentsSvc',
			StudentDetailController
		]);
})();
