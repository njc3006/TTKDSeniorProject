(function() {
	function StudentDetailController($scope, $stateParams, StudentsService) {
		$scope.formatPhoneNumber = function(phone) {
			if (phone === undefined) {
				return null;
			}

			return '(' + phone.substring(0, 3) + ') ' + phone.substring(3, 6) + '-' + phone.substring(6);
		};

		$scope.studentInfo = {};
		$scope.primaryEmergencyContact = {};
		$scope.secondaryEmergencyContact = {};
		$scope.studentRequestFailed = false;

		StudentsService.getStudent($stateParams.studentId).then(function(response) {
			$scope.studentInfo = response.data.person;
			console.log($scope.studentInfo);
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
