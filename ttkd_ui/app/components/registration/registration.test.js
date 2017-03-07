describe('Registration', function() {
	function hasError(element) {
		return element.getAttribute('class').then(function (classes) {
			return classes.split(' ').indexOf('has-error') !== -1;
    });
	}

	describe('General Functionality', function() {
		beforeEach(() => {
			browser.get(browser.params.registrationUrl);
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
	});

	describe('Basic Info', function() {
		beforeEach(() => {
			browser.get(browser.params.registrationUrl);
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

		it('should always have at least one email field');

		it('should allow user to continue once all info has been entered');

		it('should allow user to move between pages the user has visited before');
	});

	describe('Emergency Contacts', function() {
		beforeEach(() => {
			browser.get(browser.params.registrationUrl);
		});

		it('should always require primary contact info');

		it('should only require secondary contact info if at least one field is entered');
	});

	describe('Review Screen', function() {
		beforeEach(() => {
			browser.get(browser.params.registrationUrl);
		});

		it('should show all info user has entered');

		it('should show a success alert when submission is successful');
	});
});
