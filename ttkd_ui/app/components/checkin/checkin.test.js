// Describe the group of tests
describe('Student Checkin', function () {

    beforeEach(() => {
        browser.get(browser.params.appUrl + 'checkin/1');
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

    it('Login and assert date and mode buttons are present', function () {
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

        element(by.id('logout')).click();
    });

    it('Login and un-checkin the first person, and checkin the last', function () {
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
            // verify student was checked in
            element.all(by.css('.checked')).count().then(function (newNumChecked) {
                expect(newNumChecked).toEqual(oldNumChecked + 1);
            });
        });

        element(by.id('logout')).click();
    });

    // TODO create tests to assert the date picker works, and the other two modes work
    // TODO long term add an instructor to the class and make sure all functions work with them

});