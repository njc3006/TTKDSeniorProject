(function() {
	function createRegistrationPayload(registrationInfo) {
		var formattedMonth = registrationInfo.dob.value.getMonth() < 9 ?
			'0' + (registrationInfo.dob.value.getMonth() + 1) :
			(registrationInfo.dob.value.getMonth() + 1);

		var formattedDate = registrationInfo.dob.value.getDate() < 10 ?
			'0' + registrationInfo.dob.value.getDate() :
			registrationInfo.dob.value.getDate();

		var secondaryPhoneGiven = registrationInfo.secondaryPhone !== undefined;

		return {
			person: {
				'first_name': registrationInfo.firstName,
				'last_name': registrationInfo.lastName,
				'dob': registrationInfo.dob.value.getFullYear() + '-' + formattedMonth + '-' + formattedDate,
				'primary_phone': registrationInfo.primaryPhone.replace(new RegExp('-', 'g'), ''),
				'secondary_phone': secondaryPhoneGiven ? registrationInfo.secondaryPhone.replace(new RegExp('-', 'g'), '') : '',
				'street': registrationInfo.street,
				'city': registrationInfo.city,
				'zipcode': parseInt(registrationInfo.zipcode),
				'state': registrationInfo.state.value,
				'emails': registrationInfo.emails.map(function(email) { return {email: email.email}; }),
				'emergency_contacts': [
					{
						'full_name': registrationInfo.emPrimaryFullName,
						'phone_number': registrationInfo.emPrimaryPhone.replace(new RegExp('-', 'g'), ''),
						'relation': registrationInfo.emPrimaryRelationship
					},
					{
						'full_name': registrationInfo.emSecondaryFullName,
						'phone_number': registrationInfo.emSecondaryPhone.replace(new RegExp('-', 'g'), ''),
						'relation': registrationInfo.emSecondaryRelationship
					}
				]
			},
			'program': registrationInfo.program.id
		};
	}

	function RegistrationController($scope, $timeout, $state, RegistrationService, ProgramsService, StateService) {
		$scope.isLegalAdult = function() {
			var ageInYears = (new Date()).getFullYear() - $scope.registrationInfo.dob.value.getFullYear();

			return ageInYears >= 18;
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

		$scope.onSubmit = function(formIsValid) {
			$scope.submitted = true;

			$scope.registrationInfo.emails.forEach(function(email) {
				email.isNew = false;
			});

			if (formIsValid) {
				if ($scope.currentSelectionIndex < $scope.formSections.length - 1) {
						$scope.selectFormSection($scope.currentSelectionIndex + 1);
				} else {
					var registrationPayload = createRegistrationPayload($scope.registrationInfo);
					RegistrationService.registerStudent(registrationPayload).then(function(response) {
						$scope.registrationSuccess = true;
						window.scrollTo(0, 0);
						$timeout($state.reload, 1000); // Give people time to read the success message
					}, function(error) {
						$scope.registrationFailure = true;
						window.scrollTo(0, 0);
						console.error(error);
					});
				}
			}
		};

		$scope.addEmail = function() {
			$scope.registrationInfo.emails.push({email: '', isNew: true});
			$scope.numElements++;
		};

		$scope.removeEmail = function(index) {
			$scope.registrationInfo.emails.splice(index, 1);
			$scope.numElements--;
		};

		$scope.selectFormSection = function(index) {
			if (index === $scope.formSections.length - 1) {
				$scope.submitText = 'Submit';
			} else {
				$scope.submitText = 'Continue';
			}

			$scope.currentFocusIndex = 0;
			$scope.currentSelectionIndex = index;
			$scope.currentFormTpl = $scope.formSections[index].templateUrl;
			$scope.numElements = index === 2 ?
				($scope.isLegalAdult() ? 1 : 2) :
				$scope.formSections[index].baseFieldCount;

			$scope.visitedSections[index] = true;
			$scope.submitted = false;
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
			return $scope.registrationInfo.emails.map(function(email) { return email.email; }).join(', ');
		};

		$scope.openCalendar = function($event) {
			$scope.registrationInfo.dob.open = true;
		};

		$scope.registrationSuccess = false;
		$scope.registrationFailure = false;

		$scope.registrationInfo = {
			emails: [{email: '', isNew: true}],
			dob: {
				open: false,
				value: new Date()
			}
		};

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
		ProgramsService.getPrograms().then(function(response) {
			$scope.programs = response.data;
		}, function(error) {
			//TODO: error handling
		});
	}

	angular.module('ttkdApp.registationCtrl', [
		'ttkdApp.registrationSvc',
		'ttkdApp.stateService',
		'ttkdApp.programsSvc'
	]).controller('RegistrationCtrl', [
		'$scope',
		'$timeout',
		'$state',
		'RegistrationSvc',
		'ProgramsSvc',
		'StateSvc',
		RegistrationController
	]);
})();
