(function() {
	function reformatObject(object) {
		reformatted = {};

		for (var field in object) {
			var camelCased = field.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });

			reformatted[camelCased] = object[field];
		}

		return reformatted;
	}

	function StudentDetailController($scope, $stateParams, StudentsService) {
		$scope.notYetImplemented = function() {
			alert('This feature has not yet been implemented');
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

			return moment($scope.studentInfo.dob).format('MM/DD/YYYY');
		};

		$scope.getFormattedEmailList = function() {
			if ($scope.studentInfo === undefined || $scope.studentInfo.emails === undefined) {
				return null;
			}

			return $scope.studentInfo.emails.map(function(email) { return email.email; }).join(', ');
		};

		$scope.studentInfo = {};
		$scope.beltBorderStyle = {};
		$scope.primaryEmergencyContact = {};
		$scope.secondaryEmergencyContact = {};
		$scope.studentRequestFailed = false;

		StudentsService.getStudent($stateParams.studentId).then(function(response) {
			$scope.studentInfo = reformatObject(response.data.person);

			if ($scope.studentInfo.belt !== null) {
				$scope.beltBorderStyle = {
					'border-style': 'solid',
					'border-color': $scope.studentInfo.belt
				};
			}

			$scope.studentInfo.picture = 'http://placehold.it/350x350';
			$scope.studentInfo.dob = new Date($scope.studentInfo.dob);

			$scope.primaryEmergencyContact   = reformatObject($scope.studentInfo.emergencyContacts[0]);
			$scope.secondaryEmergencyContact = reformatObject($scope.studentInfo.emergencyContacts[1]);
		}, function(error) {
			console.error(error);
			$scope.studentRequestFailed = true;
		});
	}

	angular.module('ttkdApp.studentDetailController', ['ttkdApp.studentsService', 'ttkdApp.telLinkDir'])
		.controller('StudentDetailCtrl', [
			'$scope',
			'$stateParams',
			'StudentsSvc',
			StudentDetailController
		]);
})();
