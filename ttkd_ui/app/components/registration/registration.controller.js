(function() {
	function createRegistrationPayload(registrationInfo, isPartialRegistration) {
		var payload = angular.copy(registrationInfo);

		payload.program = parseInt(payload.program);
		payload['is_partial'] = isPartialRegistration;

		if (payload.person.dob) {
			payload.person.dob = moment(payload.person.dob).format('YYYY-MM-DD');
		}

		if (payload.person.state) {
			payload.person.state = payload.person.state.value;
		}

		if (payload.person['secondary_phone'] === undefined) {
			payload.person['secondary_phone'] = '';
		}

		if (angular.equals(payload.person['emergency_contact_1'], {})) {
			delete payload.person['emergency_contact_1'];
		}

		if (angular.equals(payload.person['emergency_contact_2'], {})) {
			delete payload.person['emergency_contact_2'];
		}

		if (angular.equals(payload.person.waivers[0], {})) {
			payload.person.waivers = [];
		}

		return payload
	}

	function RegistrationController(
		$scope,
		$rootScope,
		$timeout,
		$state,
		$stateParams,
		RegistrationService,
		ProgramsService,
		StateService
	) {
		$rootScope.showCurrentProgram = !$stateParams.hideCurrentProgram;
		var isPartialRegistration = $stateParams.partial;

		if (isPartialRegistration) {
			$scope.canVisit = function(sectionIndex) { return true; };

			$scope.isFieldRequired = function(fieldName) {
				return fieldName === 'firstName' ||
					fieldName === 'lastName' ||
					fieldName === 'program' ||
					fieldName === 'email' ||
					fieldName === 'primaryPhone';
			};

			$scope.fieldHasSuccess = function(fieldName) {
				if (!$scope.registrationInfo || $stateParams.registrationId) {
					return true;
				}

				if (angular.isString($scope.registrationInfo.person[fieldName])) {
					return $scope.registrationInfo.person[fieldName].length > 0;
				} else if (fieldName === 'dob') {
					return $scope.registrationInfo.person.dob.value;
				}

				return $scope.registrationInfo.person[fieldName];
			};

			//Initialize registration info
			$scope.registrationInfo = {
				person: {
					emails: [{email: ''}],
					dob: {
						open: false,
					},
					'emergency_contact_1': {},
					'emergency_contact_2': {},
					waivers: [{}]
				}
			};
		} else {
			$scope.canVisit = function(sectionIndex) {
				return $scope.visitedSections[sectionIndex];
			};

			$scope.isFieldRequired = function(fieldName) {
				if (fieldName.indexOf('emSecondary') !== -1) {
					return $scope.anySecondaryContactInfoEntered();
				}

				if (fieldName === 'secondaryPhone') {
					return false;
				}

				return true;
			};

			$scope.fieldHasSuccess = function(fieldName) { return true; };

			//Load partial registration data if id is provided
			if ($stateParams.registrationId) {
				RegistrationService.getPartialRegistration($stateParams.registrationId).then(
					function success(response) {
						$scope.registrationInfo = response.data;

						$scope.registrationInfo.program = '' + $scope.registrationInfo.program;

						if (!$scope.registrationInfo.person.emails || $scope.registrationInfo.person.emails.length === 0) {
							$scope.registrationInfo.person.emails = [{email: ''}];
						}

						if ($scope.registrationInfo.person['emergency_contact_2'] === null) {
							$scope.registrationInfo.person['emergency_contact_2'] = {};
						}

						$scope.registrationInfo.person.dob = {
							value: moment($scope.registrationInfo.person.dob, 'YYYY-MM-DD').toDate(),
							open: false
						}
					},
					function failure(error) {
						$scope.partialNotLoaded = true;
						$scope.partialNotLoadedStatus = error.status;
					}
				);
			} else {
				//Initialize registration info
				$scope.registrationInfo = {
					person: {
						emails: [{email: ''}],
						dob: {
							open: false,
						},
						'emergency_contact_1': {},
						'emergency_contact_2': {},
						waivers: [{}]
					}
				};
			}
		}

		$scope.isLegalAdult = function() {
			var today = moment();
			var birthday = moment($scope.registrationInfo.person.dob.value);

			var ageInYears = today.diff(birthday, 'years');

			return ageInYears >= 18;
		};

		$scope.isTooYoung = function() {
			if (! $scope.registrationInfo || !$scope.registrationInfo.person.dob.value) {
				return false;
			}

			var today = moment();
			var birthday = moment($scope.registrationInfo.person.dob.value);

			var ageInYears = today.diff(birthday, 'years');

			return ageInYears <= 1;
		};

		$scope.formattedDob = function() {
			return moment($scope.registrationInfo.person.dob.value).format('MM/DD/YYYY');
		};

		$scope.formattedPhoneNumber = function(phone) {
			if (phone === undefined || phone === null || phone.length === 0) {
				return '';
			}

			return '(' + phone.substring(0, 3) + ') ' + phone.substring(3, 6) + '-' + phone.substring(6);
		};

		$scope.waiverSigned = function() {
			var participantSignaturePresent = $scope.registrationInfo.participantSignature !== undefined &&
				$scope.registrationInfo.participantSignature !== '';

			if (!$scope.isLegalAdult()) {
				var guardianSignaturePresent = $scope.registrationInfo.guardianSignature !== undefined &&
					$scope.registrationInfo.guardianSignature !== '';

				return participantSignaturePresent && guardianSignaturePresent;
			} else {
				return participantSignaturePresent;
			}
		};

		$scope.anySecondaryContactInfoEntered = function() {
			if (!$scope.registrationInfo) {
				return false;
			}

			var secondaryContact = $scope.registrationInfo.person['emergency_contact_2'];

			var fullNameEntered = secondaryContact['full_name'] && secondaryContact['full_name'].length > 0;
			var phoneEntered = secondaryContact['phone_number'] && secondaryContact['phone_number'].length > 0;
			var relationEntered = secondaryContact['relation'] && secondaryContact['relation'].length > 0;

			return fullNameEntered || phoneEntered || relationEntered;
		};

		$scope.onSubmit = function(formIsValid) {
			var registrationPayload;

			if (!isPartialRegistration) {
				if (formIsValid) {
					if ($scope.currentSelectionIndex < $scope.formSections.length - 1) {
							$scope.selectFormSection($scope.currentSelectionIndex + 1);
					} else {
						registrationPayload = createRegistrationPayload($scope.registrationInfo, isPartialRegistration);

						if ($stateParams.registrationId) {
							RegistrationService.completePartialRegistration(registrationPayload.id, registrationPayload).then(
								function success(response) {
									$scope.registrationSuccess = true;
									window.scrollTo(0, 0);
									$timeout(function(){ $state.go('home'); }, 1000); // Give people time to read the success message
								},
								function failure(error) {
									$scope.registrationFailure = true;
									window.scrollTo(0, 0);
								}
							);
						} else {
							RegistrationService.registerStudent(registrationPayload).then(function(response) {
								$scope.registrationSuccess = true;
								window.scrollTo(0, 0);
								$timeout($state.reload, 1000); // Give people time to read the success message
							}, function(error) {
								$scope.registrationFailure = true;
								window.scrollTo(0, 0);
							});
						}
					}
				}
			} else {
				if (formIsValid) {
					registrationPayload = createRegistrationPayload($scope.registrationInfo, isPartialRegistration);
					RegistrationService.registerStudent(registrationPayload).then(function(response) {
						$scope.registrationSuccess = true;
						window.scrollTo(0, 0);
						$timeout(function(){ $state.go('home'); }, 1000); // Give people time to read the success message
					}, function(error) {
						$scope.registrationFailure = true;
						window.scrollTo(0, 0);
						console.error(error);
					});
				}
			}
		};

		$scope.addEmail = function() {
			$scope.registrationInfo.person.emails.push({email: ''});
			$scope.numElements++;
		};

		$scope.removeEmail = function(index) {
			$scope.registrationInfo.emails.splice(index, 1);
			$scope.numElements--;
		};

		function submitText(index) {
			if (!isPartialRegistration) {
				if (index === $scope.formSections.length - 1) {
					return 'Submit';
				} else {
					return 'Continue';
				}
			}

			return 'Submit';
		}

		$scope.selectFormSection = function(index) {
			$scope.submitText = submitText(index);

			$scope.currentFocusIndex = 0;
			$scope.currentSelectionIndex = index;
			$scope.currentFormTpl = $scope.formSections[index].templateUrl;
			$scope.numElements = index === 2 ?
				($scope.isLegalAdult() ? 1 : 2) :
				$scope.formSections[index].baseFieldCount;

			$scope.visitedSections[index] = true;
		};

		$scope.focusNext = function() {
			if ($scope.currentFocusIndex < $scope.numElements - 1) {
				$scope.currentFocusIndex++;
			}
		};

		$scope.focusPrevious = function() {
			if ($scope.currentFocusIndex > 0) {
				$scope.currentFocusIndex--;
			}
		};

		$scope.setFocus = function(index) {
			$scope.currentFocusIndex = index;
		};

		$scope.getFormattedEmailList = function() {
			return $scope.registrationInfo.person.emails.map(function(email) { return email.email; }).join(', ');
		};

		$scope.openCalendar = function() {
			$scope.registrationInfo.person.dob.open = true;
		};

		$scope.registrationSuccess = false;
		$scope.registrationFailure = false;

		$scope.visitedSections = {};
		$scope.formSections = [
			{
				name: 'Basic Information',
				templateUrl: 'components/registration/basic_info/basic_info.html',
				baseFieldCount: 11
			},
			{
				name: 'Emergency Contacts',
				templateUrl: 'components/registration/emergency_contacts/emergency_contacts.html',
				baseFieldCount: 6
			},
			{
				name: 'Waiver Signature',
				templateUrl: 'components/registration/waiver/waiver_sign.html',
			},
			{
				name: 'Review Registration',
				templateUrl: 'components/registration/review/reviewRegistration.html',
				baseFieldCount: 1
			}
		];

		$scope.currentFocusIndex = 0;
		$scope.currentSelectionIndex = 0;
		$scope.selectFormSection($scope.currentSelectionIndex);

		$scope.states = StateService.getStates();

		ProgramsService.getActivePrograms().then(function(response) {
			$scope.programs = response.data;
		}, function(error) {
			//TODO: error handling
		});
	}

	angular.module('ttkdApp.registationCtrl', [
		'ttkdApp.registrationSvc',
		'ttkdApp.stateService',
		'ttkdApp.programsSvc',
		'ngMask'
	]).controller('RegistrationCtrl', [
		'$scope',
		'$rootScope',
		'$timeout',
		'$state',
		'$stateParams',
		'RegistrationSvc',
		'ProgramsSvc',
		'StateSvc',
		RegistrationController
	]);
})();
