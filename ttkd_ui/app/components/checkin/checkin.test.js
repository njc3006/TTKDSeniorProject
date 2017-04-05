// Describe the group of tests
describe('Student Checkin', function () {

    beforeAll(() => {
        browser.get(browser.params.appUrl + 'checkin');
        var mock_code = function () {
          angular.module('InsertCookie', ['ngCookies'])
          .run(function ($cookies) {
            $cookies.putObject('currentProgram',{
                id: 1,
                name: 'Adult Self-Defense Wednesday',
                active: true
            });
          });
        };
        browser.addMockModule('InsertCookie', mock_code);
    });

    beforeEach(() => {
        browser.get(browser.params.appUrl + 'checkin');
    });

    it('The three mode selection and date should not be present', function () {
        expect(element.all(by.id('checkinModeBtn')).count()).toBe(0);
        expect(element.all(by.id('viewModeBtn')).count()).toBe(0);
        expect(element.all(by.id('editModeBtn')).count()).toBe(0);
        expect(element.all(by.id('datePicker')).count()).toBe(0);
    });

    it('There is at least one unchecked in student', function () {
        // select the first student by getting the first element with the .unchecked css class
        var numUnchecked = element.all(by.css('.unchecked')).count();
        // verify that we retrieved a student
        expect(numUnchecked).toBeGreaterThan(0);
    });

    // define a test to run
    it('Check someone in to program 1', function () {
        // select the first student by getting the first element with the .unchecked css class
        var firstStudent = element.all(by.css('.unchecked')).first();
        // verify that we retrieved a student
        expect(firstStudent.isPresent()).toBeTruthy();

        // Click the student to pop open the modal
        firstStudent.click();
        browser.driver.sleep(1);
        browser.waitForAngular();

        // check that modal is open
        var yesBtn = element(by.css('#checkin-yes'));
        expect(yesBtn.isPresent()).toBeTruthy();

        /*
         record how many students are currently checked in.
         Note: .count() is a promise. Normally, pomises are resolved in expect(), but in order
         to compare to counts, we need to chain them with .then commands to make sure they resolve. */
        element.all(by.css('.checked')).count().then(function (oldNumChecked) {
            // click the yes button
            yesBtn.click();
            browser.driver.sleep(1);
            browser.waitForAngular();

            var checkedInStringCount = element.all(
                by.xpath('//span[contains(text(),\'Total Checked In: 1/5\')]')).count();
            expect(checkedInStringCount).toBe(1);

            // verify student was checked in
            element.all(by.css('.checked')).count().then(function (newNumChecked) {
                expect(newNumChecked).toEqual(oldNumChecked + 1);
            });
        });
    });

    it('Make sure a student can\'t uncheck somebody', function () {
        // get a checked in student
        var checkedStudent = element.all(by.css('.checked')).first();

        // make sure the person exists
        expect(checkedStudent.isPresent()).toBeTruthy();

        checkedStudent.getCssValue('pointer-events').then(function (value) {
            expect(value).toEqual('none');
        });
    });

    it('Login and assert date and mode buttons are present for both admin and instructor', function () {
        element(by.id('login')).click();
        browser.driver.sleep(1000);

        element(by.name('username')).sendKeys('admin');
        element(by.name('password')).sendKeys('admin');
        element(by.id('loginBtn')).click();

        browser.driver.sleep(3000);

        expect(element.all(by.id('checkinModeBtn')).count()).toBe(1);
        expect(element.all(by.id('viewModeBtn')).count()).toBe(1);
        expect(element.all(by.id('editModeBtn')).count()).toBe(1);
        expect(element.all(by.id('datePicker')).count()).toBe(1);

        element(by.id('userBtn')).click();
        element(by.id('logout')).click();
        browser.driver.sleep(3000);

        element(by.id('login')).click();
        browser.driver.sleep(1000);

        element(by.name('username')).sendKeys('instruct');
        element(by.name('password')).sendKeys('admin');
        element(by.id('loginBtn')).click();

        element(by.id('instructorCheckinBtn')).click();
        browser.driver.sleep(3000);

        expect(element.all(by.id('checkinModeBtn')).count()).toBe(1);
        expect(element.all(by.id('viewModeBtn')).count()).toBe(1);
        expect(element.all(by.id('editModeBtn')).count()).toBe(1);
        expect(element.all(by.id('datePicker')).count()).toBe(1);

        element(by.id('userBtn')).click();
        element(by.id('logout')).click();
    });

    it('Login as an admin and un-checkin the first person, and checkin the last', function () {
        element(by.id('login')).click();
        browser.driver.sleep(1000);

        element(by.name('username')).sendKeys('admin');
        element(by.name('password')).sendKeys('admin');
        element(by.id('loginBtn')).click();

        browser.driver.sleep(3000);

        var firstStudent = element.all(by.css('.checked')).first();
        // verify that we retrieved a student
        expect(firstStudent.isPresent()).toBeTruthy();

        element.all(by.css('.checked')).count().then(function (oldNumChecked) {
            // click and un-check them in
            firstStudent.click();
            browser.driver.sleep(1);
            browser.waitForAngular();

            var checkedInStringCount = element.all(
                by.xpath('//span[contains(text(),\'Total Checked In: 0/5\')]')).count();
            expect(checkedInStringCount).toBe(1);

            // verify student was checked in
            element.all(by.css('.checked')).count().then(function (newNumChecked) {
                expect(newNumChecked).toEqual(oldNumChecked - 1);
            });
        });

        var lastStudent = element.all(by.css('.unchecked')).last();
        // verify that we retrieved a student
        expect(lastStudent.isPresent()).toBeTruthy();

        element.all(by.css('.checked')).count().then(function (oldNumChecked) {
            // click and un-check them in
            lastStudent.click();
            browser.driver.sleep(1);
            browser.waitForAngular();

            var checkedInStringCount = element.all(
                by.xpath('//span[contains(text(),\'Total Checked In: 1/5\')]')).count();
            expect(checkedInStringCount).toBe(1);

            // verify student was checked in
            element.all(by.css('.checked')).count().then(function (newNumChecked) {
                expect(newNumChecked).toEqual(oldNumChecked + 1);
            });
        });

        element(by.id('userBtn')).click();
        element(by.id('logout')).click();
    });

    it('Login as an instructor and un-checkin the only checked in person', function () {
        element(by.id('login')).click();
        browser.driver.sleep(1000);

        element(by.name('username')).sendKeys('instruct');
        element(by.name('password')).sendKeys('admin');
        element(by.id('loginBtn')).click();

        browser.driver.sleep(3000);

        var checkedInStudent = element.all(by.css('.checked')).first();
        // verify that we retrieved a student
        expect(checkedInStudent.isPresent()).toBeTruthy();

        element.all(by.css('.checked')).count().then(function (oldNumChecked) {
            // click and un-check them in
            checkedInStudent.click();
            browser.driver.sleep(1);
            browser.waitForAngular();

            var checkedInStringCount = element.all(
                by.xpath('//span[contains(text(),\'Total Checked In: 0/5\')]')).count();
            expect(checkedInStringCount).toBe(1);

            // verify student was checked in
            element.all(by.css('.checked')).count().then(function (newNumChecked) {
                expect(newNumChecked).toEqual(oldNumChecked - 1);
            });
        });

        element(by.id('userBtn')).click();
        element(by.id('logout')).click();
    });

    it('Login as an instructor and checkin someone for the 7th of the month', function () {
        element(by.id('login')).click();
        browser.driver.sleep(1000);

        element(by.name('username')).sendKeys('instruct');
        element(by.name('password')).sendKeys('admin');
        element(by.id('loginBtn')).click();

        browser.driver.sleep(3000);

        element(by.id('calendarBtn')).click();
        // Find the first 7 in the calendar and click on it using xpath
        element(by.xpath('(//span[text()=\'07\'])[1]')).click();
        browser.driver.sleep(3000);

        var firstStudent = element.all(by.css('.unchecked')).first();
        // verify that we retrieved a student
        expect(firstStudent.isPresent()).toBeTruthy();

        element.all(by.css('.checked')).count().then(function (oldNumChecked) {
            // click and check them in
            firstStudent.click();
            browser.driver.sleep(1);
            browser.waitForAngular();

            var checkedInStringCount = element.all(
                by.xpath('//span[contains(text(),\'Total Checked In: 1/5\')]')).count();
            expect(checkedInStringCount).toBe(1);

            // verify student was checked in
            element.all(by.css('.checked')).count().then(function (newNumChecked) {
                expect(newNumChecked).toEqual(oldNumChecked + 1);
            });
        });

        element(by.id('userBtn')).click();
        element(by.id('logout')).click();
    });

    it('Login as an instructor and un-checkin someone for the 7th of the month', function () {
        element(by.id('login')).click();
        browser.driver.sleep(1000);

        element(by.name('username')).sendKeys('instruct');
        element(by.name('password')).sendKeys('admin');
        element(by.id('loginBtn')).click();

        browser.driver.sleep(3000);

        element(by.id('calendarBtn')).click();
        // Find the first 7 in the calendar and click on it using xpath
        element(by.xpath('(//span[text()=\'07\'])[1]')).click();
        browser.driver.sleep(3000);

        var firstStudent = element.all(by.css('.checked')).first();
        // verify that we retrieved a student
        expect(firstStudent.isPresent()).toBeTruthy();

        element.all(by.css('.checked')).count().then(function (oldNumChecked) {
            // click and un-check them in
            firstStudent.click();
            browser.driver.sleep(1);
            browser.waitForAngular();

            var checkedInStringCount = element.all(
                by.xpath('//span[contains(text(),\'Total Checked In: 0/5\')]')).count();
            expect(checkedInStringCount).toBe(1);

            // verify student was checked in
            element.all(by.css('.checked')).count().then(function (newNumChecked) {
                expect(newNumChecked).toEqual(oldNumChecked - 1);
            });
        });

        element(by.id('userBtn')).click();
        element(by.id('logout')).click();
    });

    it('Login as an instructor and assert no one is checked in on the the 7th of the month', function () {
        element(by.id('login')).click();
        browser.driver.sleep(1000);

        element(by.name('username')).sendKeys('instruct');
        element(by.name('password')).sendKeys('admin');
        element(by.id('loginBtn')).click();

        browser.driver.sleep(3000);

        element(by.id('calendarBtn')).click();
        // Find the first 7 in the calendar and click on it using xpath
        element(by.xpath('(//span[text()=\'07\'])[1]')).click();
        browser.driver.sleep(3000);

        var numChecked = element.all(by.css('.checked')).count();
        // verify that we retrieved a student
        expect(numChecked).toBe(0);

        element(by.id('userBtn')).click();
        element(by.id('logout')).click();
    });

    it('Login as an instructor and test the view button', function () {
        element(by.id('login')).click();
        browser.driver.sleep(1000);

        element(by.name('username')).sendKeys('instruct');
        element(by.name('password')).sendKeys('admin');
        element(by.id('loginBtn')).click();

        browser.driver.sleep(3000);

        element(by.id('viewModeBtn')).click();

        // Click on Brenda TTKD now that we are in view mode
        element(by.xpath('//span[text()=\'Brenda TTKD\']')).click();

        browser.driver.sleep(3000);

        // Now that we are on the page, make sure it is Brenda's by finding her name and address.
        // Using a contains here because the span has a newline in it or something weird
        var countOfName = element.all(by.xpath('//span[contains(text(),\'Brenda TTKD\')]')).count();
        expect(countOfName).toBe(1);

        var countOfAddress = element.all(
            by.xpath('//span[text()=\'123 TTKD Lane, No Where, KS 12345\']')).count();
        expect(countOfAddress).toBe(1);

        element(by.id('userBtn')).click();
        element(by.id('logout')).click();
    });

    it('Login as an admin and test the view button', function () {
        element(by.id('login')).click();
        browser.driver.sleep(1000);

        element(by.name('username')).sendKeys('admin');
        element(by.name('password')).sendKeys('admin');
        element(by.id('loginBtn')).click();

        browser.driver.sleep(3000);

        element(by.id('viewModeBtn')).click();

        // Click on Brenda TTKD now that we are in view mode
        element(by.xpath('//span[text()=\'Brenda TTKD\']')).click();

        browser.driver.sleep(3000);

        // Now that we are on the page, make sure it is Brenda's by finding her name and address.
        // Using a contains here because the span has a newline in it or something weird
        var countOfName = element.all(by.xpath('//span[contains(text(),\'Brenda TTKD\')]')).count();
        expect(countOfName).toBe(1);

        var countOfAddress = element.all(
            by.xpath('//span[text()=\'123 TTKD Lane, No Where, KS 12345\']')).count();
        expect(countOfAddress).toBe(1);

        element(by.id('userBtn')).click();
        element(by.id('logout')).click();
    });

    it('Login as an instructor and test the edit button', function () {
        element(by.id('login')).click();
        browser.driver.sleep(1000);

        element(by.name('username')).sendKeys('instruct');
        element(by.name('password')).sendKeys('admin');
        element(by.id('loginBtn')).click();

        browser.driver.sleep(3000);

        element(by.id('editModeBtn')).click();

        // Click on Brenda TTKD now that we are in edit mode
        element(by.xpath('//span[text()=\'Brenda TTKD\']')).click();

        browser.driver.sleep(3000);

        // Now that we are on edit page, make sure there is current belt, and that there is not
        // a first name input which would mean we are on an admin edit student
        // Using a contains here because the span has a newline in it or something weird
        var countOfBelt = element.all(by.xpath('//span[contains(text(),\'Available Stripes\')]')).count();
        expect(countOfBelt).toBe(1);

        var countOfNameInput = element.all(by.css('input[name=\'firstName\']')).count();
        expect(countOfNameInput).toBe(0);

        element(by.id('backBtn')).click();
        browser.driver.sleep(3000);

        // Validate we are on the checkin page again by finding unchecked class
        expect(element.all(by.css('.unchecked')).count()).toBeGreaterThan(0);

        // Make sure we are still in edit mode after returning
        var valueOfActive =  element(by.id('editModeBtn')).getAttribute('class');
        expect(valueOfActive).toContain('active');

        element(by.id('userBtn')).click();
        element(by.id('logout')).click();
    });

    it('Login as an admin and test the edit button', function () {
        element(by.id('login')).click();
        browser.driver.sleep(1000);

        element(by.name('username')).sendKeys('admin');
        element(by.name('password')).sendKeys('admin');
        element(by.id('loginBtn')).click();

        browser.driver.sleep(3000);

        element(by.id('editModeBtn')).click();

        // Click on Brenda TTKD now that we are in edit mode
        element(by.xpath('//span[text()=\'Brenda TTKD\']')).click();

        browser.driver.sleep(3000);

        // Now that we are on edit page, make sure there is a first name input which would mean we
        // are on an admin edit student

        var countOfNameInput = element.all(by.css('input[name=\'firstName\']')).count();
        expect(countOfNameInput).toBe(1);

        element(by.id('backBtn')).click();
        browser.driver.sleep(3000);

        // Validate we are on the checkin page again by finding unchecked class
        expect(element.all(by.css('.unchecked')).count()).toBeGreaterThan(0);

        // Make sure we are still in edit mode after returning
        var valueOfActive =  element(by.id('editModeBtn')).getAttribute('class');
        expect(valueOfActive).toContain('active');

        element(by.id('userBtn')).click();
        element(by.id('logout')).click();
    });

    // TODO once the ui supports it, add an instructor to the class and make sure all functions work with them

});