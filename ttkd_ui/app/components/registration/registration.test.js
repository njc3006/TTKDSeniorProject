describe('Registration', function() {
	describe('General Functionality', function() {
		beforeEach(() => {
			browser.get(browser.params.registrationUrl);
		});

		it('should not allow user to submit without filling out info');

		it('should not allow user to move between pages without filling out info');

		it('should allow user to continue once all info has been entered');

		it('should allow user to move between pages the user has visited before');
	});

	describe('Basic Info', function() {
		beforeEach(() => {
			browser.get(browser.params.registrationUrl);
		});

		it('should require a program');

		it('should require a first name');

		it('should require a last name');

		it('should require a DOB');

		it('should require an address');

		it('should require a city');

		it('should require a state');

		it('should require a zipcode');

		it('should require a primary phone number');

		it('should always have at least one email field');
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
