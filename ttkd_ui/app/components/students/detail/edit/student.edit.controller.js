(function() {
	function EditStudentController($scope, $stateParams, $http, apiHost, StudentsService, StateService) {
		$scope.makeBeltSquare = function(primaryColor, secondaryColor) {
			return {
				width: '20px',
				height: '10px',
				'background-color': primaryColor,
				'border-bottom': '10px solid ' + secondaryColor
			};
		};

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
			$scope.studentInfo.emails.push({email: ''});
		};

		$scope.removeEmail = function(index) {
			$scope.studentInfo.emails.splice(index, 1);
		};

		$scope.openDob = function() {
			$scope.studentInfo.dob.open = true;
		};

		$scope.onAllStripeClick = function(index) {
			var selectedStripe = $scope.allStripes[index];

			selectedStripe.active = !selectedStripe.active;

			if (selectedStripe.active) {
				$scope.selectedFromAllStripes.push($scope.allStripes[index]);
			} else {
				$scope.selectedFromAllStripes = $scope.selectedFromAllStripes.filter(function(stripe) {
					return stripe.id !== selectedStripe.id;
				});
			}
		};

		$scope.onStudentStripeClick = function(index) {
			var selectedStripe = $scope.studentStripes[index];

			selectedStripe.active = !selectedStripe.active;

			if (selectedStripe.active) {
				$scope.selectedFromStudentStripes.push(index);
			} else {
				$scope.selectedFromStudentStripes = $scope.selectedFromStudentStripes.filter(function(idx) {
					return idx !== index;
				});
			}
		};

		$scope.addSelectedStripesToStudent = function() {
			$scope.studentStripes = $scope.studentStripes.concat($scope.selectedFromAllStripes.map(function(stripe) {
				var newStripe = {};
				angular.copy(stripe, newStripe);
				newStripe.active = false;
				return newStripe;
			}));

			$scope.selectedFromAllStripes = [];
			$scope.allStripes.forEach(function(stripe) {
				stripe.active = false;
			});
		};

		$scope.removeSelectedStripesFromStudent = function() {
			$scope.selectedFromStudentStripes.sort();
			for (var i = $scope.selectedFromStudentStripes.length - 1; i > -1; i--) {
				$scope.studentStripes.splice($scope.selectedFromStudentStripes[i], 1);
			}

			$scope.selectedFromStudentStripes = [];
		};

		$scope.submitChanges  = function() {
			var payload = angular.copy($scope.studentInfo);
			payload = angular.extend(payload, {
				dob: moment($scope.studentInfo.dob.value).format('YYYY-MM-DD'),
				state: $scope.studentInfo.state.value
			});

			StudentsService.updateStudentInfo($stateParams.studentId, payload).then(function success(response) {
				StudentsService.updateStudentBelt($stateParams.studentId, $scope.oldPersonBelt, $scope.newBelt.id).then(
					function success(response) {
						//TODO: compute stripe deltas and submit to API

						$scope.requestFlags.submission.success = true;
					},
					function failure(error) {

					}
				);
			}, function failure(error) {
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

		$scope.selectedFromAllStripes = [];
		$scope.selectedFromStudentStripes = [];

		$scope.studentInfo = {};
		$scope.newBelt = {};

		$scope.states = StateService.getStates();

		$http.get(apiHost + '/api/stripes/').then(
			function success(response) {
				$scope.allStripes = response.data.map(function(stripe) {
					stripe.active = false;
					return stripe;
				});
			},
			function failure(error) {
				$scope.requestFlags.loading.failure = true;
			}
		);

		StudentsService.getStudent($stateParams.studentId).then(function success(response) {
			$scope.studentInfo = response.data;

			$scope.studentStripes = $scope.studentInfo.stripes.filter(function(stripe) {
				return stripe['current_stripe'];
			}).map(function(personStripe) {
				var copy = {};
				angular.copy(personStripe.stripe, copy);
				copy.active = false;
				return copy;
			});

			$scope.studentInfo.dob = {
				value: moment($scope.studentInfo.dob, 'YYYY-MM-DD').toDate(),
				open: false
			};

			// Add empty entries to emergency contacts as necesary (up to 2)
			if (!$scope.studentInfo['emergency_contact_1']) {
				$scope.studentInfo['emergency_contact_1'] = {};
			}

			if (!$scope.studentInfo['emergency_contact_2']) {
				$scope.studentInfo['emergency_contact_2'] = {};
			}

			if ($scope.studentInfo.belts.length > 0) {
					var currentBelt;

					if ($scope.studentInfo.belts.length === 1) {
							currentBelt = $scope.studentInfo.belts[0];
					} else {
							currentBelt = $scope.studentInfo.belts.reduce(function(prev, curr) {
									if (curr['current_belt']) {
											return curr;
									} else {
											return prev;
									}
							});
					}

					$scope.currentBelt = currentBelt.belt;
					$scope.oldPersonBelt = currentBelt;
					//$scope.beltStyle = getBeltStyle(currentBelt);
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
		'ttkdApp.emergencyContactDir',
		'ttkdApp.constants'
	]).controller('EditStudentCtrl', [
		'$scope',
		'$stateParams',
		'$http',
		'apiHost',
		'StudentsSvc',
		'StateSvc',
		EditStudentController
	]);
})();
