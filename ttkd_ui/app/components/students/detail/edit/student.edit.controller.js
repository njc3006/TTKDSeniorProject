(function() {
	function EditStudentController($scope, $stateParams, StudentsService, StateService) {
		$scope.addEmail = function() {
			$scope.registrationInfo.emails.push({email: '', isNew: true});
		};

		$scope.removeEmail = function(index) {
			$scope.registrationInfo.emails.splice(index, 1);
		};

		$scope.openDob = function() {
			$scope.studentInfo.dob.open = true;
		};

		$scope.studentInfo = {};

		$scope.states = StateService.getStates();

		StudentsService.getStudent($stateParams.studentId).then(function success(response) {
			$scope.studentInfo = response.data;

			$scope.studentInfo.dob = {
				value: moment($scope.studentInfo.dob, 'YYYY-MM-DD').toDate(),
				open: false
			};

			$scope.studentInfo.state = {
				id: $scope.studentInfo.state,
				value: $scope.studentInfo.state
			};
		}, function failure(error) {

		});
	}

	angular.module('ttkdApp.editStudentCtrl', ['ttkdApp.studentsService', 'ttkdApp.stateService'])
		.controller('EditStudentCtrl', ['$scope', '$stateParams', 'StudentsSvc', 'StateSvc', EditStudentController]);
})();
