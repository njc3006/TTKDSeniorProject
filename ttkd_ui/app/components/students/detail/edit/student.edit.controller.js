(function() {
	function EditStudentController($scope, $stateParams, StudentsService, StateService) {
		$scope.anySecondaryContactInfoEntered = function() {
			if ($scope.studentInfo === undefined) {
				return false;
			} else if (!$scope.studentInfo['emergency_contact_2']) {
				return false;
			}

			var secondary = $scope.studentInfo['emergency_contact_2'];

			var secondaryFullNameEntered = secondary['full_name'] !== undefined && secondary['full_name'].length > 0;
			var secondaryPhoneEntered = secondary['phone_number'] !== undefined && secondary['phone_number'].length > 0;
			var secondaryRelationEntered = secondary.relation !== undefined && secondary.relation.length > 0;

			return secondaryFullNameEntered || secondaryPhoneEntered || secondaryRelationEntered;
		};

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
			var payload = angular.copy($scope.studentInfo);
			payload = angular.extend(payload, {
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

			// Add empty entries to emergency contacts as necesary (up to 2)
			if (!$scope.studentInfo['emergency_contact_1']) {
				$scope.studentInfo['emergency_contact_1'] = {};
			}

			if (!$scope.studentInfo['emergency_contact_2']) {
				$scope.studentInfo['emergency_contact_2'] = {};
			}

			$scope.requestFlags.loading.done = true;
		}, function failure(error) {
			$scope.requestFlags.loading.failure = true;
			$scope.requestFlags.loading.done = true;
		});
	}

	angular.module('ttkdApp.editStudentCtrl', [
		'ttkdApp.studentsService',
		'ttkdApp.stateService',
		'ttkdApp.emergencyContactDir'
	]).controller('EditStudentCtrl', ['$scope', '$stateParams', 'StudentsSvc', 'StateSvc', EditStudentController]);
})();
