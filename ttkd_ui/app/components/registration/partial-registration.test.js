describe('Partial Registration', function() {
	function hasError(element) {
 		return element.getAttribute('class').then(function (classes) {
 			return classes.split(' ').indexOf('has-error') !== -1;
    });
	}

	function testRequired(model, input, isSelect) {
		var elem = element(by.model(model));

		if (isSelect) {
			elem.element(by.cssContainingText('option', input)).click();
			elem.element(by.cssContainingText('option', 'Select a Program')).click();
		} else {
			elem.sendKeys(input);
			elem.clear();
		}

		var parentDiv = elem.element(by.xpath('../..'));
		expect(hasError(parentDiv)).toBe(true);
	}

	function login() {
		element(by.id('login')).click();
		browser.driver.sleep(1000);

		element(by.name('username')).sendKeys('admin');
		element(by.name('password')).sendKeys('admin');
		element(by.id('loginBtn')).click();

		browser.driver.sleep(1000);
	}

	function completePartialRegistration() {
		var program = element(by.model('registrationInfo.program')),
			firstName = element(by.model('registrationInfo.person.first_name')),
			lastName = element(by.model('registrationInfo.person.last_name')),
			phoneNumber = element(by.model('registrationInfo.person.primary_phone')),
			emailAddress = element(by.id('email0'));

		program.element(by.cssContainingText('option', 'Adult Self-Defense Wednesday')).click();
		firstName.sendKeys('First');
		lastName.sendKeys('Name');
		phoneNumber.sendKeys('1234567890');
		emailAddress.sendKeys('email@email.net');

		element(by.css('[type=submit]')).submit();
	}

	describe('New Partial Registration', function() {
		beforeEach(() => {
			login();
			browser.get(browser.params.appUrl + 'partial-registrations/new');
		});

		afterEach(() => {
			element(by.id('userBtn')).click();
			element(by.id('logout')).click();
		});

    it('should display both continue and submit buttons', function() {
			var submitButton = element(by.css('[type=submit]')),
				continueButton = element(by.id('contiue-button'));

			expect(submitButton.isDisplayed() && continueButton.isDisplayed()).toBe(true);
    });

		it('should require a phone number or email', function() {
			var failureAlert = element(by.id('failureAlert'));
			var missingEmailAndPhone = element(by.id('missingEmailAndPhone'));
			var submitButton = element(by.css('[type=submit]'));

			submitButton.click();

			expect(failureAlert.isDisplayed() && missingEmailAndPhone.isDisplayed()).toBe(true);
		});

		it('should require a first name', function() {
			testRequired('registrationInfo.person.first_name', 'First');
		});

		it('should require a last name', function() {
			testRequired('registrationInfo.person.last_name', 'Name');
		});

		it('should require a program', function() {
			testRequired('registrationInfo.program', 'Adult Self-Defense Wednesday', true);
		});
	});

	describe('Completing a Partial Registration', function() {
		beforeAll(() => {
			login();
			browser.get(browser.params.appUrl + 'partial-registrations/new');
			completePartialRegistration();
			element(by.id('userBtn')).click();
			element(by.id('logout')).click();
		});

		beforeEach(() => {
			browser.get(browser.params.appUrl + 'partial-registrations');
			element.all(by.css('a.h2')).filter(function(elem, index) {
				return elem.getText().then(function(text) {
				  return text === 'First Name';
				});
			}).first().click();
		});

		it('should have an email and phone number input', function() {
			var verificationEmail = element(by.model('verificationEmail')),
				verificationPhone = element(by.model('verificationPhone'));

			expect(verificationEmail.isDisplayed() && verificationPhone.isDisplayed()).toBe(true);
		});

		it('should require either a phone number or email address', function() {
			element(by.id('authRegistration')).click();
			expect(element(by.id('noInputAlert')).isDisplayed()).toBe(true);
		});

		it('should display an error if an incorrect phone number is entered', function() {
			var verificationPhone = element(by.model('verificationPhone'));
			verificationPhone.sendKeys('0987654321');

			element(by.id('authRegistration')).click();

			expect(element(by.id('incorrectPhoneNumber')).isDisplayed()).toBe(true);
		});

		it('should display an error if an incorrect email address is entered', function() {
			var verificationEmail = element(by.model('verificationEmail'));
			verificationEmail.sendKeys('email@gmail.com');

			element(by.id('authRegistration')).click();

			expect(element(by.id('incorrectEmail')).isDisplayed()).toBe(true);
		});

		it('should pre-load information for a partial registration', function() {
			var verificationPhone = element(by.model('verificationPhone'));
			verificationPhone.sendKeys('1234567890');

			element(by.id('authRegistration')).click();

			var program = element(by.model('registrationInfo.program')),
				firstName = element(by.model('registrationInfo.person.first_name')),
				lastName = element(by.model('registrationInfo.person.last_name')),
				phoneNumber = element(by.model('registrationInfo.person.primary_phone')),
				emailAddress = element(by.id('email0'));

			expect(program.getAttribute('value')).toBe('1')
			expect(firstName.getAttribute('value')).toBe('First');
			expect(lastName.getAttribute('value')).toBe('Name');
			expect(phoneNumber.getAttribute('value')).toBe('(123) 456-7890');
			expect(emailAddress.getAttribute('value')).toBe('email@email.net');
		});
	});
});
