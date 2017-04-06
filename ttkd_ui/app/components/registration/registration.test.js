describe('Registration', function() {
	function hasError(element) {
		return element.getAttribute('class').then(function (classes) {
			return classes.split(' ').indexOf('has-error') !== -1;
    });
	}

	function fillOutBasicInfo(isOverEighteen) {
		var programSelect = element(by.model('registrationInfo.program'));
		programSelect.element(by.cssContainingText('option', 'Adult Self-Defense Wednesday')).click();

		element(by.model('registrationInfo.person.first_name')).sendKeys('First Name');
		element(by.model('registrationInfo.person.last_name')).sendKeys('Last Name');

		if (isOverEighteen) {
			element(by.model('registrationInfo.person.dob.value')).sendKeys('01/01/1996');
		} else {
			element(by.model('registrationInfo.person.dob.value')).sendKeys('01/01/2010');
		}

		element(by.model('registrationInfo.person.street')).sendKeys('123 Street St');
		element(by.model('registrationInfo.person.city')).sendKeys('Townsville');

		var stateSelect = element(by.model('registrationInfo.person.state'));
		stateSelect.element(by.cssContainingText('option', 'NY')).click();

		element(by.model('registrationInfo.person.zipcode')).sendKeys('12345');
		element(by.model('registrationInfo.person.primary_phone')).sendKeys('1234567890');
		element(by.id('email0')).sendKeys('email@test.com');
	}

	function fillOutPrimaryEmergencyContactInfo() {
		element(by.model('registrationInfo.person.emergency_contact_1.full_name')).sendKeys('Dad Name');
		element(by.model('registrationInfo.person.emergency_contact_1.phone_number')).sendKeys('1234567890');
		element(by.model('registrationInfo.person.emergency_contact_1.relation')).sendKeys('Father');
	}

	function fillOutWaiverSignature() {
		element(by.model('registrationInfo.person.waivers[0].waiver_signature')).sendKeys('First Name');
		element(by.model('registrationInfo.person.waivers[0].guardian_signature')).sendKeys('Dad Name');
	}

	var REGISTRATION_URL = browser.params.appUrl + 'registration';

	describe('General Functionality', function() {
		beforeEach(() => {
			browser.get(REGISTRATION_URL);
		});

		it('should not allow user to submit without filling out info', function() {
			var submitButton = element(by.css('[type=submit]'));
			expect(submitButton.isDisplayed()).toBe(false);
		});

		it('should not allow user to move between pages without filling out info', function(done) {
			var continueButton = element(by.id('contiue-button'));
			expect(continueButton.isDisplayed()).toBe(true);

			continueButton.getAttribute('disabled').then(function(disabled) {
				expect(disabled).toBe('true')
				done();
			});
		});

		it('should display a success message on successful submit', function(done) {
			fillOutBasicInfo();
			element(by.id('contiue-button')).click();
			fillOutPrimaryEmergencyContactInfo();
			element(by.id('contiue-button')).click();
			fillOutWaiverSignature();
			element(by.id('contiue-button')).click();

			element(by.css('[type=submit]')).click();
			expect(element(by.id('registration-success')).isDisplayed()).toBe(true);

			browser.driver.sleep(1000);

			browser.getCurrentUrl().then(function(url) {
	      expect(url).toBe(REGISTRATION_URL);
				done();
	    });
		});
	});

	describe('Basic Info', function() {
		beforeEach(() => {
			browser.get(REGISTRATION_URL);
		});

		it('should require a program', function() {
			var programSelect = element(by.model('registrationInfo.program'));

			//Select the first program
			programSelect.element(by.cssContainingText('option', 'Adult Self-Defense Wednesday')).click();

			//Then unselect it
			programSelect.element(by.cssContainingText('option', 'Select a Program')).click();

			var parentDiv = programSelect.element(by.xpath('../..'));
			expect(hasError(parentDiv)).toBe(true);
		});

		it('should require a first name', function(done) {
			var firstName = element(by.model('registrationInfo.person.first_name'));

			firstName.sendKeys('First Name').then(function() {
				firstName.clear();

				var parentDiv = firstName.element(by.xpath('../..'));
				expect(hasError(parentDiv)).toBe(true);

				done();
			});
		});

		it('should require a last name', function(done) {
			var lastName = element(by.model('registrationInfo.person.last_name'));

			lastName.sendKeys('Last Name').then(function() {
				lastName.clear();

				var parentDiv = lastName.element(by.xpath('../..'));
				expect(hasError(parentDiv)).toBe(true);

				done();
			});
		});

		it('should require a DOB', function(done) {
			var dob = element(by.model('registrationInfo.person.dob.value'));

			dob.sendKeys('01/01/2001').then(function() {
				dob.clear();

				var parentDiv = dob.element(by.xpath('../..'));
				expect(hasError(parentDiv)).toBe(true);

				done();
			});
		});

		it('should require DOB to be over a year old', function(done) {
			var dob = element(by.model('registrationInfo.person.dob.value'));

			dob.sendKeys('01/01/2017').then(function() {
				var parentDiv = dob.element(by.xpath('../..'));
				expect(hasError(parentDiv)).toBe(true);

				done();
			});
		});

		it('should require an address', function(done) {
			var street = element(by.model('registrationInfo.person.street'));

			street.sendKeys('123 Street St').then(function() {
				street.clear();

				var parentDiv = street.element(by.xpath('../..'));
				expect(hasError(parentDiv)).toBe(true);

				done();
			});
		});

		it('should require a city', function(done) {
			var city = element(by.model('registrationInfo.person.city'));

			city.sendKeys('Townsville').then(function() {
				city.clear();

				var parentDiv = city.element(by.xpath('../..'));
				expect(hasError(parentDiv)).toBe(true);

				done();
			});
		});

		it('should require a state', function() {
			var stateSelect = element(by.model('registrationInfo.person.state'));

			//Select the first program
			stateSelect.element(by.cssContainingText('option', 'NY')).click();

			//Then unselect it
			stateSelect.element(by.cssContainingText('option', 'State')).click();

			var parentDiv = stateSelect.element(by.xpath('../..'));
			expect(hasError(parentDiv)).toBe(true);
		});

		it('should require a zipcode', function(done) {
			var zipcode = element(by.model('registrationInfo.person.zipcode'));

			zipcode.sendKeys('12345').then(function() {
				zipcode.clear();

				var parentDiv = zipcode.element(by.xpath('../..'));
				expect(hasError(parentDiv)).toBe(true);

				done();
			});
		});

		it('should ensure zipcode is only valid if it\'s 5-digits', function(done) {
			var zipcode = element(by.model('registrationInfo.person.zipcode'));

			zipcode.sendKeys('123456').then(function() {
				var parentDiv = zipcode.element(by.xpath('../..'));
				expect(hasError(parentDiv)).toBe(true);

				done();
			});
		});

		it('should require a primary phone number', function(done) {
			var primaryPhone = element(by.model('registrationInfo.person.primary_phone'));

			primaryPhone.sendKeys('2134567890').then(function() {
				primaryPhone.clear();

				var parentDiv = primaryPhone.element(by.xpath('../..'));
				expect(hasError(parentDiv)).toBe(true);

				done();
			});
		});

		it('should enforce primary phone number format', function(done) {
			var primaryPhone = element(by.model('registrationInfo.person.primary_phone'));

			primaryPhone.sendKeys('abc').then(function() {
				var parentDiv = primaryPhone.element(by.xpath('../..'));
				expect(hasError(parentDiv)).toBe(true);

				done();
			});
		});

		it('should not required a secondary phone number', function(done) {
			var secondaryPhone = element(by.model('registrationInfo.person.secondary_phone'));

			secondaryPhone.sendKeys('2134567890').then(function() {
				secondaryPhone.clear();

				var parentDiv = secondaryPhone.element(by.xpath('..'));
				expect(hasError(parentDiv)).toBe(false);

				done();
			});
		});

		it('should validate secondary phone if it\'s provided', function(done) {
			var secondaryPhone = element(by.model('registrationInfo.person.secondary_phone'));

			secondaryPhone.sendKeys('2134abc').then(function() {
				var parentDiv = secondaryPhone.element(by.xpath('..'));
				expect(hasError(parentDiv)).toBe(true);

				done();
			});
		});

		it('should always have at least one email field', function() {
			var firstEmailInput = element(by.id('email0'));
			var firstRemoveButton = element(by.id('remove0'));
			expect(firstEmailInput.isDisplayed()).toBe(true);
			expect(firstRemoveButton.isDisplayed()).toBe(false);
		});

		it('should show a remove button for each row if there is more than one email field', function () {
			element(by.id('add0')).click();

			var firstRemoveButton = element(by.id('remove0')),
				secondRemoveButton = element(by.id('remove1'));

			expect(firstRemoveButton.isDisplayed() && secondRemoveButton.isDisplayed()).toBe(true);
		});

		it('should allow user to continue once all info has been entered', function(done) {
			fillOutBasicInfo();

			var continueButton = element(by.id('contiue-button'));
			expect(continueButton.isDisplayed()).toBe(true);

			continueButton.getAttribute('disabled').then(function(disabled) {
				expect(disabled).toBe(null)
				done();
			});
		});
	});

	describe('Emergency Contacts', function() {
		beforeEach(() => {
			browser.get(REGISTRATION_URL);
			fillOutBasicInfo();
			element(by.id('contiue-button')).click();
		});

		it('should allow user to move between pages the user has visited before', function(done) {
			var firstTab = element(by.id('tab0'));
			firstTab.getAttribute('disabled').then(function(disabled) {
				expect(disabled).toBe(null)
				done();
			});
		});

		it('should always require primary contact full name', function(done) {
			var emPrimaryFullName = element(by.model('registrationInfo.person.emergency_contact_1.full_name'));

			emPrimaryFullName.sendKeys('Dad Name').then(function() {
				emPrimaryFullName.clear();

				var parentDiv = emPrimaryFullName.element(by.xpath('../..'));
				expect(hasError(parentDiv)).toBe(true);

				done();
			});
		});

		it('should always require primary contact phone', function(done) {
			var emPrimaryPhone = element(by.model('registrationInfo.person.emergency_contact_1.phone_number'));

			emPrimaryPhone.sendKeys('12345678990').then(function() {
				emPrimaryPhone.clear();

				var parentDiv = emPrimaryPhone.element(by.xpath('../..'));
				expect(hasError(parentDiv)).toBe(true);

				done();
			});
		});

		it('should always require primary contact relation', function(done) {
			var emPrimaryRelation = element(by.model('registrationInfo.person.emergency_contact_1.relation'));

			emPrimaryRelation.sendKeys('Father').then(function() {
				emPrimaryRelation.clear();

				var parentDiv = emPrimaryRelation.element(by.xpath('../..'));
				expect(hasError(parentDiv)).toBe(true);

				done();
			});
		});

		it('should only require secondary contact info if at least one field is entered', function(done) {
			var emSecondaryFullName = element(by.model('registrationInfo.person.emergency_contact_2.full_name'));

			var allFieldsRequired = false;
			emSecondaryFullName.sendKeys('Mom Name').then(function() {
				emSecondaryFullName.getAttribute('required').then(function(isRequired) {
					allFieldsRequired = isRequired === 'true';

					var emSecondaryPhone = element(by.model('registrationInfo.person.emergency_contact_2.phone_number'));
					emSecondaryPhone.getAttribute('required').then(function(isRequired) {
						allFieldsRequired = allFieldsRequired && (isRequired === 'true');

						var emSecondaryRelation = element(by.model('registrationInfo.person.emergency_contact_2.relation'));
						emSecondaryRelation.getAttribute('required').then(function(isRequired) {
							allFieldsRequired = allFieldsRequired && (isRequired === 'true');
							expect(allFieldsRequired).toBe(true);
							done();
						});
					});
				});
			});
		});
	});

	describe('Waiver Screen', function() {
		beforeEach(() => {
			browser.get(REGISTRATION_URL);
		});

		it ('should allow you to visit both previous screens', function(done) {
			var firstTab = element(by.id('tab0')),
				secondTab = element(by.id('tab1'));
			firstTab.getAttribute('disabled').then(function(disabled1) {
				expect(disabled1).toBe(null);
				secondTab.getAttribute('disabled').then(function(disabled2) {
					expect(disabled2).toBe(null);
					done();
				});
			});
		});

		it('should have two input fields if the student is under 18', function() {
			fillOutBasicInfo();
			element(by.id('contiue-button')).click();
			fillOutPrimaryEmergencyContactInfo();
			element(by.id('contiue-button')).click();

			expect(element.all(by.css('input[type=text]')).count()).toBe(2);
		});

		it('should only have one input field if the student is over 18', function() {
			fillOutBasicInfo(true);
			element(by.id('contiue-button')).click();
			fillOutPrimaryEmergencyContactInfo();
			element(by.id('contiue-button')).click();

			expect(element.all(by.css('input[type=text]')).count()).toBe(1);
		});
	});

	describe('Review Screen', function() {
		beforeEach(() => {
			browser.get(REGISTRATION_URL);

			fillOutBasicInfo();
			element(by.id('contiue-button')).click();
			fillOutPrimaryEmergencyContactInfo();
			element(by.id('contiue-button')).click();
			fillOutWaiverSignature();
			element(by.id('contiue-button')).click();
		});

		it('should display the submit button after registration is completed', function() {
			var submitButton = element(by.css('[type=submit]'));
			expect(submitButton.isDisplayed()).toBe(true);
		});

		it ('should not display the continue button on the review screen', function() {
			expect(element(by.id('contiue-button')).isDisplayed()).toBe(false);
		})
	});
});
