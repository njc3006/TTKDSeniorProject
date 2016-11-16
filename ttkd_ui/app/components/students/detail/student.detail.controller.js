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
			function(student) {
				$scope.studentInfo = reformatObject(student);

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

					$scope.studentInfo.stripes = $scope.studentInfo.stripes.filter(function(personStripe) {
						return personStripe['current_stripe'];
					});

					$scope.beltStyle = getBeltStyle(currentBelt);

					StudentsService.convertPersonStripesToStripes($scope.studentInfo.stripes)
						.then(function(stripes) {
							$scope.earnedStripes = stripes;
							$scope.studentLoaded = true;
						});
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
