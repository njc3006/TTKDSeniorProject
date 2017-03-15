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

	describe('New Partial Registration',function() {
		beforeEach(() => {
			browser.get(browser.params.appUrl + 'partial-registrations/new')
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
});
