describe('Student Detail Page', function() {
	const STUDENT_PAGE_BASE_URL = browser.params.appUrl + 'students/';

	function login(username, password) {
		element(by.id('login')).click();

		element(by.name('username')).sendKeys(username);
		element(by.name('password')).sendKeys(password);
		element(by.id('loginBtn')).click();

		browser.driver.sleep(500);
	}

	function logout() {
		element(by.id('userBtn')).click();
		element(by.id('logout')).click();
	}

	describe('Visibility -', function() {
		beforeEach(() => {
			browser.get(browser.params.appUrl);
		});

	  it('should redirect to home page if user is not logged in', function() {
	    browser.get(STUDENT_PAGE_BASE_URL + '36');
			expect(browser.getCurrentUrl()).toBe(browser.params.appUrl);
	  });

	  it('should not redirect if the user is an instructor', function() {
			login('instruct', 'admin');

			browser.get(STUDENT_PAGE_BASE_URL + '36');
			expect(browser.getCurrentUrl()).toBe(STUDENT_PAGE_BASE_URL + '36');

			logout();
	  });

		it('should not redirect if the user is an admin', function() {
			login('admin', 'admin');

			browser.get(STUDENT_PAGE_BASE_URL + '36');
			expect(browser.getCurrentUrl()).toBe(STUDENT_PAGE_BASE_URL + '36');

			logout();
	  });
	});

	describe('General Info Contents -', function() {
		beforeEach(() => {
			login('admin', 'admin');
			browser.get(STUDENT_PAGE_BASE_URL + '36');
		});

		afterEach(logout);

		it('should contain the student\'s picture', function() {
			expect(element(by.css('picture')).isDisplayed()).toBe(true);
		});

		it('should contain an area to display the students\'s stripes', function() {
			expect(element(by.css('svg')).isDisplayed()).toBe(true);
		});

		it('should contain 0 or more stripes within the students\'s stripes area', function(done) {
			element.all(by.css('svg rect')).count().then(function(count) {
				expect(count >= 0).toBe(true);
				done();
			});
		});

		it('should contain bold text to highlight important sections', function(done) {
			element.all(by.css('.info-text')).count().then(function(count) {
				expect(count >= 21).toBe(true);
				done();
			});
		});

		it('should contain an edit button', function() {
			expect(element(by.css('.btn-warning')).isDisplayed()).toBe(true);
		});

		it('should contain all of a student\'s basic contact information', function() {
			expect(element.all(by.css('.col-xs-9 .row')).count()).toBe(6);
		});

		it('should contain the student\'s name in the first row', function() {
			var firstNameRow = element.all(by.css('.col-xs-9 .row')).first();
			expect(firstNameRow.element(by.css('span')).getText()).toBe('Adam TTKD');
		});

		it('should contain whether a student is active in the second row', function() {
			var statusRow = element.all(by.css('.col-xs-9 .row')).get(1),
				titleSpan = statusRow.all(by.css('span')).first(),
				statusSpan = statusRow.all(by.css('span')).get(1);

			expect(titleSpan.getText()).toBe('Status:');
			expect(statusSpan.getText()).toBe('Active');
		});

		it('should contain age and birthday in the third row', function() {
			var ageRow = element.all(by.css('.col-xs-9 .row')).get(2),
				ageTitleSpan = ageRow.all(by.css('span')).first(),
				ageSpan = ageRow.all(by.css('span')).get(1),
				bdayTitleSpan = ageRow.all(by.css('span')).get(2),
				bdaySpan = ageRow.all(by.css('span')).get(3);

			expect(ageTitleSpan.getText()).toBe('Age:');
			expect(ageSpan.getText()).toBe('8');
			expect(bdayTitleSpan.getText()).toBe('Birthday:');
			expect(bdaySpan.getText()).toBe('05/19/2008');
		});

		it('should have at least one phone number be visible', function(done) {
			var phoneNumberRow = element.all(by.css('.col-xs-9 .row')).get(3);

			phoneNumberRow.all(by.css('tel-link')).count().then(function(count) {
				expect(count >= 1).toBe(true);
				done();
			});
		});

		it('should contain an address in the fourth row', function() {
			var addrRow = element.all(by.css('.col-xs-9 .row')).get(4),
				titleSpan = addrRow.all(by.css('span')).first(),
				addressSpan = addrRow.all(by.css('span')).get(1);

			expect(titleSpan.getText()).toBe('Address:');
			expect(addressSpan.getText()).toBe('123 TTKD Lane, No Where, KS 12345');
		});

		it('should contain email addressses in the fifth row', function(done) {
			var emailAddrRow = element.all(by.css('.col-xs-9 .row')).get(5),
				titleSpan = emailAddrRow.all(by.css('span')).first(),
				emailsSpans = emailAddrRow.all(by.css('span a'));

			expect(titleSpan.getText()).toBe('Emails:');
			emailsSpans.count().then(function(count) {
				expect(count >= 1).toBe(true);
				done();
			});
		});

		it('should contain panels for both emergency contacts', function() {
			expect(element.all(by.css('.panel.col-xs-5')).count()).toBe(2);
		});

		it('should contain five tabs', function() {
			expect(element.all(by.className('uib-tab')).count()).toBe(6);
		});

		it('tabs should have titles: Notes, Attendance, Achievements, Waiver, Programs, Student Instruction', function() {
			var titles = element.all(by.css('.uib-tab a')).map(function(element) {
				return element.getText();
			});

			expect(titles).toEqual([
				'Notes',
				'Attendance',
				'Achievements',
				'Waiver',
				'Programs',
				'Student Instruction'
			]);
		});
	});

  describe('Tabs -', function() {
		beforeEach(() => {
			login('admin', 'admin');
			browser.get(STUDENT_PAGE_BASE_URL + '36');
		});

		afterEach(logout);

		it('should have a panel for notes under the notes panel', function() {
			element.all(by.className('uib-tab')).first().click();
			expect(element(by.id('notes-panel')).isDisplayed()).toBe(true);
		});
  });
});
