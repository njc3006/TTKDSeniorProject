// Describe the group of tests
describe('Student List', function () {

    beforeEach(() => {
        browser.get(browser.params.appUrl + 'studentlist');
    });

    it('Test the showing student count and changing program', function () {

        element(by.id('login')).click();
        browser.driver.sleep(1000);

        element(by.name('username')).sendKeys('admin');
        element(by.name('password')).sendKeys('admin');
        element(by.id('loginBtn')).click();

        browser.driver.sleep(1000);
        browser.get(browser.params.appUrl + 'studentlist');
        browser.driver.sleep(3000);
        browser.waitForAngular();

        // Running the test suit will increment the number of students, so this test can only
        // validate that the showing text contains at least a 1
		expect(element(by.id('studentCount')).getText()).toContain('Showing 1');

        element(by.id('programSelect')).click();
        element(by.cssContainingText('option', 'Tiny Ninjas Monday')).click();
        browser.driver.sleep(1000);

        expect(element(by.id('studentCount')).getText()).toContain('Showing 14 students');

		// element(by.id('userBtn')).click();
		// element(by.id('logout')).click();
    });

    it('Test all information appearing', function () {

        var emailSpan = element(by.xpath('(//h2[text()=\'Abigail TTKD\']/../../..//span)[1]'));
        var phoneSpan = element(by.xpath('(//h2[text()=\'Abigail TTKD\']/../../..//span)[3]'));
        var emc1Span = element(by.xpath('(//h2[text()=\'Abigail TTKD\']/../../..//span)[5]'));
        var emc2Span = element(by.xpath('(//h2[text()=\'Abigail TTKD\']/../../..//span)[8]'));

        expect(emailSpan.getText()).toBe('Email: fakeemail157@masked.com');

        // Since phone numbers are random with masked data, this is the best we can do
        expect(phoneSpan.getText()).toContain('Phone: (');
        expect(emc1Span.getText()).toContain('Emergency Contact 1: Deborah - (');
        expect(emc2Span.getText()).toContain('Emergency Contact 2: James - (');
    });


    it('Test belt searching', function () {

        element(by.id('beltSelect')).click();
        element(by.cssContainingText('option', 'Blue')).click();
        browser.driver.sleep(1000);

		var studentCount = element.all(by.className('img-responsive')).count();

		var blueBeltCount = element.all(By.css('img[style*=\'border-color: rgb(0, 0, 255)\']')).count();

        // Assert that all images have a blue belt
        expect(blueBeltCount).toBe(studentCount);
    });

    it('Test a-z sort', function () {

        var h2Tags = element.all(by.xpath('//h2'));

        var firstH2Tag = h2Tags.first();
        var lastH2Tag = h2Tags.last();

        expect(firstH2Tag.getText()).toBe('Abigail TTKD');
        expect(lastH2Tag.getText()).toBe('Zachary TTKD');

        element(by.id('alphaSortBtn')).click();

        h2Tags = element.all(by.xpath('//h2'));

        firstH2Tag = h2Tags.first();
        lastH2Tag = h2Tags.last();

        expect(firstH2Tag.getText()).toBe('Zachary TTKD');
        expect(lastH2Tag.getText()).toBe('Abigail TTKD');
    });

     it('Test active and inactive', function () {

        element(by.xpath('//h2[text()=\'Abigail TTKD\']')).click();
        browser.driver.sleep(1000);
        element(by.xpath('//A[text()=\'Edit\']')).click();
        browser.driver.sleep(1000);
        element(by.id('activeBtn')).click();
        element(by.id('updateBtn')).click();
        browser.driver.sleep(1000);

        element(by.id('backBtn')).click();
        browser.driver.sleep(1000);
        element(by.id('backBtn')).click();
        browser.driver.sleep(1000);


		var abigailCount = element.all(by.xpath('//h2[text()=\'Abigail TTKD\']')).count();
		expect(abigailCount).toBe(0);

		element(by.name('activeBox')).click();
		browser.driver.sleep(1000);
		var studentCount = element.all(by.className('img-responsive')).count();
		expect(studentCount).toBe(0);

		element(by.name('inactiveBox')).click();
		browser.driver.sleep(1000);
		abigailCount = element.all(by.xpath('//h2[text()=\'Abigail TTKD\']')).count();
		expect(abigailCount).toBe(1);
		studentCount = element.all(by.className('img-responsive')).count();
		expect(studentCount).toBe(1);

		element(by.name('activeBox')).click();
		browser.driver.sleep(1000);
		abigailCount = element.all(by.xpath('//h2[text()=\'Abigail TTKD\']')).count();
		expect(abigailCount).toBe(1);
		studentCount = element.all(by.className('img-responsive')).count();
		expect(studentCount).toBeGreaterThan(1);

		element(by.xpath('//h2[text()=\'Abigail TTKD\']')).click();
        browser.driver.sleep(1000);
        element(by.xpath('//A[text()=\'Edit\']')).click();
        browser.driver.sleep(1000);
        element(by.id('activeBtn')).click();
        element(by.id('updateBtn')).click();
        browser.driver.sleep(1000);
    });

    it('Test case insensitive searching', function () {

        var searchBox =  element(by.id('searchbox'));

        searchBox.sendKeys('allen');
        browser.driver.sleep(1000);

        var allenCount = element.all(by.xpath('//h2[text()=\'Allen TTKD\']')).count();
		expect(allenCount).toBe(1);
		var studentCount = element.all(by.className('img-responsive')).count();
		expect(studentCount).toBe(1);
		expect(element(by.id('studentCount')).getText()).toBe('Showing 1 student');

		searchBox.clear();
		browser.driver.sleep(1000);

		studentCount = element.all(by.className('img-responsive')).count();
		expect(studentCount).toBeGreaterThan(1);

		searchBox.sendKeys('Allen');
		browser.driver.sleep(1000);

		allenCount = element.all(by.xpath('//h2[text()=\'Allen TTKD\']')).count();
		expect(allenCount).toBe(1);
		studentCount = element.all(by.className('img-responsive')).count();
		expect(studentCount).toBe(1);
		expect(element(by.id('studentCount')).getText()).toBe('Showing 1 student');

		searchBox.clear();
		browser.driver.sleep(1000);

		studentCount = element.all(by.className('img-responsive')).count();
		expect(studentCount).toBeGreaterThan(1);

		searchBox.sendKeys('dAvId');
		browser.driver.sleep(1000);

		allenCount = element.all(by.xpath('//h2[text()=\'David TTKD\']')).count();
		expect(allenCount).toBe(2);
		studentCount = element.all(by.className('img-responsive')).count();
		expect(studentCount).toBe(3); // Person has a David emergency contact
        expect(element(by.id('studentCount')).getText()).toBe('Showing 3 students');
    });

    it('Test the today button', function () {

        element(by.id('todayBtn')).click();
        browser.driver.sleep(1000);

		var studentCount = element.all(by.className('img-responsive')).count();
        expect(studentCount).toBe(0);
        expect(element(by.id('studentCount')).getText()).toBe('Showing 0 students');

        browser.get(browser.params.appUrl + 'checkin/1');
        browser.waitForAngular();
        element(by.xpath('//span[text()=\'Brenda TTKD\']')).click();
        browser.get(browser.params.appUrl + 'studentlist');

        element(by.id('todayBtn')).click();
        browser.driver.sleep(1000);

		studentCount = element.all(by.className('img-responsive')).count();
        expect(studentCount).toBe(1);
        expect(element(by.id('studentCount')).getText()).toBe('Showing 1 student');
        var brendaCount = element.all(by.xpath('//h2[text()=\'Brenda TTKD\']')).count();
		expect(brendaCount).toBe(1);

		browser.get(browser.params.appUrl + 'checkin/1');
        browser.waitForAngular();
        element(by.xpath('//span[text()=\'Brenda TTKD\']')).click();
    });

    it('Test the calendar', function () {

        element(by.id('calendarBtn')).click();
        // Find the first 7 in the calendar and click on it using xpath
        element(by.xpath('(//span[text()=\'07\'])[1]')).click();
        browser.driver.sleep(3000);

		var studentCount = element.all(by.className('img-responsive')).count();
        expect(studentCount).toBe(0);
        expect(element(by.id('studentCount')).getText()).toBe('Showing 0 students');

        browser.get(browser.params.appUrl + 'checkin/1');
        browser.driver.sleep(3000);
        element(by.id('calendarBtn')).click();
        // Find the first 7 in the calendar and click on it using xpath
        element(by.xpath('(//span[text()=\'07\'])[1]')).click();
        browser.driver.sleep(3000);
        element(by.xpath('//span[text()=\'Brenda TTKD\']')).click();
        browser.driver.sleep(3000);
        browser.get(browser.params.appUrl + 'studentlist');
        browser.driver.sleep(3000);

        element(by.id('calendarBtn')).click();
        // Find the first 7 in the calendar and click on it using xpath
        element(by.xpath('(//span[text()=\'07\'])[1]')).click();
        browser.driver.sleep(3000);

		studentCount = element.all(by.className('img-responsive')).count();
        expect(studentCount).toBe(1);
        expect(element(by.id('studentCount')).getText()).toBe('Showing 1 student');
        var brendaCount = element.all(by.xpath('//h2[text()=\'Brenda TTKD\']')).count();
		expect(brendaCount).toBe(1);

		browser.get(browser.params.appUrl + 'checkin/1');
        browser.waitForAngular();
        element(by.id('calendarBtn')).click();
        // Find the first 7 in the calendar and click on it using xpath
        element(by.xpath('(//span[text()=\'07\'])[1]')).click();
        browser.driver.sleep(3000);
        element(by.xpath('//span[text()=\'Brenda TTKD\']')).click();
        browser.driver.sleep(3000);
    });
});