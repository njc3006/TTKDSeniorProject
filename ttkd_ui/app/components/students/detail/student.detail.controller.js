(function() {
	function StudentDetailController($scope, $stateParams, StudentsService) {
		$scope.studentInfo = {};
		$scope.primaryEmergencyContact = {};
		$scope.secondaryEmergencyContact = {};
		$scope.studentRequestFailed = false;

		StudentsService.getStudent($stateParams.studentId).then(function(response) {
			$scope.studentInfo = response.data;
			$scope.primaryEmergencyContact = response.data.emergency_contacts[0];
			$scope.secondaryEmergencyContact = response.data.emergency_contacts[1];
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
