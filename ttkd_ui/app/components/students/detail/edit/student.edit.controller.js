(function() {
	function EditStudentController($scope, $stateParams, StudentsService, StateService) {
		$scope.addEmail = function() {
			$scope.studentInfo.emails.push({email: '', isNew: true});
		};

		$scope.removeEmail = function(index) {
			$scope.studentInfo.emails.splice(index, 1);
		};

		$scope.openDob = function() {
			$scope.studentInfo.dob.open = true;
		};

		$scope.submitChanges  = function() {
			var payload = angular.extend($scope.studentInfo, {
				dob: moment($scope.studentInfo.dob.value).format('YYYY-MM-DD'),
				state: $scope.studentInfo.state.value
			});

			StudentsService.updateStudentInfo($stateParams.studentId, payload).then(function success(response) {
				$scope.requestFlags.submission.success = true;
			}, function failure(error) {
				console.log(error);
				$scope.requestFlags.submission.failure = true;
			});
		};

		$scope.requestFlags = {
			loading: {
				done: false,
				failure: false
			},
			submission: {
				success: false,
				failure: false
			}
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

			$scope.requestFlags.loading.done = true;
		}, function failure(error) {
			$scope.requestFlags.loading.failure = true;
			$scope.requestFlags.loading.done = true;
		});
	}

	angular.module('ttkdApp.editStudentCtrl', ['ttkdApp.studentsService', 'ttkdApp.stateService'])
		.controller('EditStudentCtrl', ['$scope', '$stateParams', 'StudentsSvc', 'StateSvc', EditStudentController]);
})();
