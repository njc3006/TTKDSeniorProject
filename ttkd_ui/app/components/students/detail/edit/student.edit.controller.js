(function() {
	function EditStudentController($scope, $state, $stateParams, $timeout, StudentsService, StateService) {
		function arrayDiff(lhs, rhs, lhsIdFunction, rhsIdFunction) {
			return lhs.filter(function(item) {
			  for (var i in rhs) {
			    if (lhsIdFunction(item) === rhsIdFunction(rhs[i])) { return false; }
			  }

			  return true;
			});
		}

		function areDifferent(lhs, rhs, lhsIdFunction, rhsIdFunction) {
			var lhsDiff = arrayDiff(lhs, rhs, lhsIdFunction, rhsIdFunction),
				rhsDiff = arrayDiff(rhs, lhs, rhsIdFunction, lhsIdFunction);

			return lhsDiff.length > 0 || rhsDiff.length > 0;
		}

		function submitStripeChanges() {
			//compute which stripes were added
			var newStripes = arrayDiff(
				$scope.studentInfo.stripes,
				$scope.studentInfo.oldStripes,
				function(item) { return item.id; },
				function(item) { return item.stripe.id; }
			);

			//compute which stripes where deleted
			var oldPersonStripes = arrayDiff(
				$scope.studentInfo.oldStripes,
				$scope.studentInfo.stripes,
				function(item) { return item.stripe.id; },
				function(item) { return item.id; }
			);

			StudentsService.updateStudentStripes(
				$stateParams.studentId,
				oldPersonStripes,
				newStripes
			).then(
				function success(responses) {
					$scope.requestFlags.submission.success = true;
					$state.go('studentDetails', {studentId: $stateParams.studentId});
				},
				function failure(error) {
					$scope.requestFlags.submission.failure = true;
					window.scrollTo(0, 0);
				}
			);
		}

		$scope.backNavigate = function() {
			var hasUnsavedChanges = false;

			angular.forEach($scope.studentInfo, function(value, key) {
				if (!hasUnsavedChanges) {
					switch (key) {
						case 'stripes':
							hasUnsavedChanges = areDifferent(
								value,
								$scope.studentInfo.oldStripes,
								function(item) { return item.id; },
								function(item) { return item.stripe.id; }
							);
							break;
						case 'currentBelt':
							hasUnsavedChanges = value.id !== $scope.studentInfo.newBelt.id;
							break;
						case 'emergency_contact_1':
						case 'emergency_contact_2':
							hasUnsavedChanges =
								value.relation !== $scope.oldStudent[key].relation ||
								value['phone_number'] !== $scope.oldStudent[key]['phone_number'] ||
								value['full_name'] !== $scope.oldStudent[key]['full_name'];
							break;
						case 'emails':
							hasUnsavedChanges = areDifferent(
								value,
								$scope.oldStudent[key],
								function(email) {return email.email;},
								function(email) {return email.email;}
							);
							break;
						case 'dob':
							hasUnsavedChanges =
								value.value.getTime() !== moment($scope.oldStudent.dob, 'YYYY-MM-DD').toDate().getTime();
							break;
						case 'state':
							hasUnsavedChanges = value.value !== $scope.oldStudent[key];
							break;
						case 'belts':
						case 'stripes':
						case 'oldStripes':
						case 'newBelt':
							break;
						default:
							hasUnsavedChanges = value !== $scope.oldStudent[key];
							break;
					}
				}
			});

			//console.log(hasUnsavedChanges);
			if (hasUnsavedChanges) {
				var shouldBackNavigate = confirm('There are unsaved changes, are you sure you wish to leave?');

				if (shouldBackNavigate) {
					$state.go('studentDetails', {studentId: $stateParams.studentId});
				}
			} else {
				$state.go('studentDetails', {studentId: $stateParams.studentId});
			}
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

		$scope.closeSuccessAlert = function() {
			$scope.requestFlags.submission.success = false;
		};

		$scope.closeErrorAlert = function() {
			$scope.requestFlags.submission.failure = false;
		};

		$scope.submitChanges  = function(formIsValid) {
			if (formIsValid) {
				var payload = angular.copy($scope.studentInfo);
				payload = angular.extend(payload, {
					dob: moment($scope.studentInfo.dob.value).format('YYYY-MM-DD'),
					state: $scope.studentInfo.state.value
				});

				StudentsService.updateStudentInfo($stateParams.studentId, payload).then(
					function success(response) {
						if ($scope.studentInfo.newBelt) {
							StudentsService.updateStudentBelt(
								$stateParams.studentId,
								$scope.oldPersonBelt,
								$scope.studentInfo.newBelt.id
							).then(
								function success(response) {
									//$scope.currentBelt = $scope.studentInfo.newBelt;
									//$scope.oldPersonBelt = response[1].data;
									submitStripeChanges();
								},
								function failure(error) {
									$scope.requestFlags.submission.failure = true;
									window.scrollTo(0, 0);
								}
							);
						} else {
							submitStripeChanges();
						}
					}, function failure(error) {
						$scope.requestFlags.submission.failure = true;
						window.scrollTo(0, 0);
					}
				);
			}
		};

		$scope.requestFlags = {
			loading: {
				done: false,
				failure: false
			},
			submission: {
				success: false,
				failure: false
			},
		};

		$scope.selectedFromAllStripes = [];
		$scope.selectedFromStudentStripes = [];

		$scope.studentInfo = {};

		$scope.states = StateService.getStates();

		StudentsService.getStudent($stateParams.studentId).then(function success(response) {
			$scope.oldStudent = angular.copy(response.data);
			delete $scope.oldStudent.belts;
			delete $scope.oldStudent.stripes;

			$scope.studentInfo = response.data;

			$scope.studentInfo.oldStripes = $scope.studentInfo.stripes.filter(function(stripe) {
				return stripe['current_stripe'];
			}).map(function(stripe) {
				var copy = {};
				angular.copy(stripe, copy);
				return copy;
			});

			$scope.studentInfo.stripes = $scope.studentInfo.stripes.filter(function(stripe) {
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

			$scope.studentInfo.state = {
				name: $scope.studentInfo.state,
				value: $scope.studentInfo.state
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
				$scope.studentInfo.newBelt = angular.copy($scope.currentBelt);
				$scope.oldPersonBelt = currentBelt;
			}

			$scope.requestFlags.loading.done = true;
		}, function failure(error) {
			$scope.requestFlags.loading.failure = true;
			$scope.requestFlags.loading.done = true;
		});

		$scope.$watch('studentInfo["newBelt"]', function(newBelt) {
			if (newBelt === null || newBelt === undefined) {
				return;
			}

			if (newBelt.id !== $scope.currentBelt.id) {
				$scope.studentInfo.stripes = [];
			} else {
				$scope.studentInfo.stripes = $scope.studentInfo.oldStripes.map(function(personStripe) {
					var copy = {};
					angular.copy(personStripe.stripe, copy);
					copy.active = false;
					return copy;
				});
			}
		});
	}

	angular.module('ttkdApp.editStudentCtrl', [
		'ttkdApp.studentsService',
		'ttkdApp.stateService',
		'ttkdApp.emergencyContactDir',
		'ttkdApp.constants'
	]).controller('EditStudentCtrl', [
		'$scope',
		'$state',
		'$stateParams',
		'$timeout',
		'StudentsSvc',
		'StateSvc',
		EditStudentController
	]);
})();
