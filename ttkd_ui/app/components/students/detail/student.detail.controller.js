(function() {
	function reformatObject(object) {
		var reformatted = {};

		for (var field in object) {
			if (object.hasOwnProperty(field)) {
				var camelCased = field
					.replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
	        .replace(/\s/g, '')
	        .replace(/^(.)/, function($1) { return $1.toLowerCase(); });

				reformatted[camelCased] = object[field];
			}
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
		$scope.earnedStripes = [];
		$scope.studentBeltClass = '';

		$scope.primaryEmergencyContact = {};
		$scope.secondaryEmergencyContact = {};

		$scope.studentLoaded = false;
		$scope.studentRequestFailed = false;
		$scope.studentDoesNotExist = false;

		StudentsService.getStudent($stateParams.studentId).then(
			function(response) {
				$scope.studentLoaded = true;

				$scope.studentInfo = reformatObject(response.data);

				$scope.studentInfo.picture = 'http://placehold.it/350x350';
				$scope.studentInfo.dob = moment($scope.studentInfo.dob, 'YYYY-MM-DD').toDate();

				$scope.primaryEmergencyContact   = reformatObject($scope.studentInfo.emergencyContact1);
				$scope.secondaryEmergencyContact = reformatObject($scope.studentInfo.emergencyContact2);

				if ($scope.studentInfo.belts.length > 0) {
					var currentBelt;

					if ($scope.studentInfo.belts.length === 1) {
						currentBelt = $scope.studentInfo.belts[0].belt;
					} else {
						currentBelt = $scope.studentInfo.belts.reduce(function(prev, curr) {
							if (curr['current_belt']) {
								return curr.belt;
							} else {
								return prev;
							}
						}, $scope.studentInfo.belts[0].belt);
					}

					$scope.studentBeltClass = currentBelt.name.toLowerCase() + '-belt';

					StudentsService.getStudentStripes($stateParams.studentId).then(function(stripes) {
						$scope.earnedStripes = stripes;
					});
				}
			},
			function(error) {
				$scope.studentLoaded = true;

				if (error.status === 404) {
					$scope.studentDoesNotExist = true;
				} else {
					$scope.studentRequestFailed = true;
				}
			}
		);
	}

	angular.module('ttkdApp.studentDetailCtrl', ['ttkdApp.studentsService', 'ttkdApp.telLinkDir'])
		.controller('StudentDetailCtrl', [
			'$scope',
			'$stateParams',
			'StudentsSvc',
			StudentDetailController
		]);
})();
