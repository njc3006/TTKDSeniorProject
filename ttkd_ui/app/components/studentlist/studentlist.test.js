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

    it('Test belt searching', function () {

        element(by.id('beltSelect')).click();
        element(by.cssContainingText('option', 'Blue')).click();
        browser.driver.sleep(1000);

		var studentCount = element.all(by.className("img-responsive")).count();

		var blueBeltCount = element.all(By.css('img[style*=\'border-color: rgb(0, 0, 255)\']')).count();

        // Assert that all images have a blue belt
        expect(blueBeltCount).toBe(studentCount);
    });
});