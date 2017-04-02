(function() {
	function createRegistrationPayload(registrationInfo, isPartialRegistration) {
		var payload = angular.copy(registrationInfo);

		if (payload.program) {
			payload.program = parseInt(payload.program);
		}

		payload['is_partial'] = isPartialRegistration;

		if (payload.person.dob.value) {
			payload.person.dob = moment(payload.person.dob.value).format('YYYY-MM-DD');
		} else {
			delete payload.person.dob;
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

	function parseErrorResponse(errors) {
		var errorMessages = [];

		angular.forEach(errors, function(value, key) {
			if (angular.isArray(value) && !angular.isObject(value[0])) {
				errorMessages = errorMessages.concat(value.map(function(error) {
					return key + ': ' + error;
				}));
			} else if (angular.isArray(value) && angular.isObject(value[0])) {
				var parsedErrors = value.map(parseErrorResponse);
				parsedErrors.forEach(function(errorArray) {
					errorMessages = errorMessages.concat(errorArray);
				});
			} else if (angular.isObject(value)) {
				errorMessages = errorMessages.concat(parseErrorResponse(value));
			}
		});

		return errorMessages;
	}

	function RegistrationController(
		$scope,
		$rootScope,
		$timeout,
		$state,
		$stateParams,
		$window,
		RegistrationService,
		ProgramsService,
		StateService
	) {
		$rootScope.showCurrentProgram = !$stateParams.hideCurrentProgram;
		$scope.isPartialRegistration = $stateParams.partial;
		$scope.dateTouched = false;

		/*
		 * Force a user to enter a valid date format that is compatible with the datepicker */
		$scope.onDateKeypress = function($event) {
			$scope.dateTouched = true;
			// if the value is a number
			if(!isNaN(parseInt($event.key))) {
				/* if the target has 1 char, and we're adding another, 
		       then add a '/' to format the date month */
				if($event.target.value.length === 1)
				{
					$event.target.value += $event.key + '/';
				}
				/* if the target has 2 chars, they must have removed the '/'. 
						Add it back. See how they like it. */
				else if($event.target.value.length === 2) {
					$event.target.value += '/' + $event.key;
				}
				/* if there are 4 characters, plus the one we're adding,
				   add a slash after the day */
				else if($event.target.value.length === 4) {
					$event.target.value += $event.key + '/'
				}
				/* if there are 5 chars, they removed a slash, so add it back. */
				else if($event.target.value.length === 5) {
					$event.target.value += '/' + $event.key;
				}
				/* otherwise just make sure its less than 10 and add another char */
				else if ($event.target.value.length < 10) {
					$event.target.value += $event.key
				}
			}
			$event.preventDefault();
		};

		if ($scope.isPartialRegistration) {
			$scope.canVisit = function(sectionIndex) { return true; };

			$scope.isFieldRequired = function(fieldName) {
				if (fieldName === 'primaryPhone') {
					return $scope.registrationInfo.person.emails.length === 1 &&
						$scope.registrationInfo.person.emails[0].email === '';
				} else if (fieldName === 'email') {
					return $scope.registrationInfo.person['primary_phone'] &&
						$scope.registrationInfo.person['primary_phone'].length > 0;
				}

				return fieldName === 'firstName' ||
					fieldName === 'lastName' ||
					fieldName === 'program';
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

						if ($scope.registrationInfo.person.dob !== null) {
							$scope.registrationInfo.person.dob = {
								value: moment($scope.registrationInfo.person.dob, 'YYYY-MM-DD').toDate(),
								open: false
							}
						} else {
							$scope.registrationInfo.person.dob = {
								open: false
							}
						}

						if ($scope.registrationInfo.person.state !== null) {
							$scope.registrationInfo.person.state = {
								name: $scope.registrationInfo.person.state,
								value: $scope.registrationInfo.person.state
							}
						} else {
							delete $scope.registrationInfo.person.state;
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
			if ($scope.registrationInfo && $scope.registrationInfo.person.dob.value) {
				var today = moment();
				var birthday = moment($scope.registrationInfo.person.dob.value);

				var ageInYears = today.diff(birthday, 'years');

				return ageInYears <= 1;
			}
			return true;
		};

		$scope.formattedDob = function() {
			if ($scope.registrationInfo.person.dob.value) {
				return moment($scope.registrationInfo.person.dob.value).format('MM/DD/YYYY');
			}

			return '';
		};

		$scope.formattedPhoneNumber = function(phone) {
			if (phone === undefined || phone === null || phone.length === 0) {
				return '';
			}

			return '(' + phone.substring(0, 3) + ') ' + phone.substring(3, 6) + '-' + phone.substring(6);
		};

		$scope.waiverSigned = function() {
			var participantSignaturePresent =
				$scope.registrationInfo.person.waivers[0].waiver_signature !== undefined &&
				$scope.registrationInfo.person.waivers[0].waiver_signature !== '';

			if (!$scope.isLegalAdult()) {
				var guardianSignaturePresent =
					$scope.registrationInfo.person.waivers[0].guardian_signature !== undefined &&
					$scope.registrationInfo.person.waivers[0].guardian_signature !== '';

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

		function sendFormDataToAPI(formIsValid) {
			var registrationPayload;

			if (!$scope.isPartialRegistration) {
				if (formIsValid) {
					registrationPayload = createRegistrationPayload($scope.registrationInfo, $scope.isPartialRegistration);

					if ($stateParams.registrationId) {
						RegistrationService.completePartialRegistration(registrationPayload.id, registrationPayload).then(
							function success(response) {
								$scope.registrationSuccess = true;
								$window.scrollTo(0, 0);
								$timeout(function(){ $state.go('home'); }, 1000); // Give people time to read the success message
							},
							function failure(error) {
								$scope.registrationFailure = true;
								$window.scrollTo(0, 0);
								$scope.registrationErrors = parseErrorResponse(error.data);
							}
						);
					} else {
						RegistrationService.registerStudent(registrationPayload).then(function(response) {
							$scope.registrationSuccess = true;
							$window.scrollTo(0, 0);
							$timeout($state.reload, 1000); // Give people time to read the success message
						}, function(error) {
							$scope.registrationFailure = true;
							$window.scrollTo(0, 0);
							$scope.registrationErrors = parseErrorResponse(error.data);
						});
					}
				}
			} else {
				registrationPayload = createRegistrationPayload($scope.registrationInfo, $scope.isPartialRegistration);

				//if neither phone number nor emails were entered,
				var phoneEntered = registrationPayload.person['primary_phone'] &&
					registrationPayload.person['primary_phone'] !== '';
				var noEmailsEntered = registrationPayload.person.emails.length === 1 &&
					(registrationPayload.person.emails[0].email === undefined ||
					registrationPayload.person.emails[0].email.length === 0);

				if (phoneEntered || !noEmailsEntered) {
					if (noEmailsEntered) {
						delete registrationPayload.person.emails;
					}

					$scope.missingEmailAndPhone = false;

					RegistrationService.registerStudent(registrationPayload).then(
						function success(response) {
							$scope.registrationSuccess = true;
							$scope.registrationFailure = false;
							$window.scrollTo(0, 0);
							$timeout(function(){ $state.go('home'); }, 1000); // Give people time to read the success message
						},
						function error(error) {
							$scope.registrationFailure = true;
							$window.scrollTo(0, 0);
							$scope.registrationErrors = parseErrorResponse(error.data);
						}
					);
				} else {
					$scope.registrationFailure = true;
					$scope.missingEmailAndPhone = true;
					$window.scrollTo(0, 0);
				}
			}
		}

		$scope.onSubmit = function(formIsValid) {
			if ($scope.isPartialRegistration) {
				sendFormDataToAPI(formIsValid);
			} else {
				if ($scope.currentSelectionIndex !== $scope.formSections.length - 1) {
          if (formIsValid) {
					  $scope.selectFormSection($scope.currentSelectionIndex + 1);
          }
				} else {
					sendFormDataToAPI(formIsValid);
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

		$scope.selectFormSection = function(index) {
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
		if ($scope.isPartialRegistration) {
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
					name: 'Review Registration',
					templateUrl: 'components/registration/review/reviewRegistration.html',
					baseFieldCount: 1
				}
			];
		} else {
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
		}

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
		'$window',
		'RegistrationSvc',
		'ProgramsSvc',
		'StateSvc',
		RegistrationController
	]);
})();
