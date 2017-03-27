// Describe the group of tests
var utils = require('./test.utils.js')
describe('User Management', function () {

    beforeEach(() => {
        browser.get(browser.params.appUrl);
        if(element.all(by.id('login')).count() !== 0) {
            utils.Logout();
        }
    });

    afterEach(() => {
    });

    it('Test instructor can\'t see manage user button in dropdown', function() {
        utils.Login('instruct', 'admin');

        element(by.id('account')).click();
        browser.driver.sleep(1);
        expect(element.all(by.id('manageAccounts')).count()).toBe(0);
    });

    it('Test instructor can change own password', function() {
        utils.Login('instruct', 'admin');

        element(by.id('account')).click();
        browser.driver.sleep(1);
        element(by.id('changePass')).click()
        browser.driver.sleep(1);
        element(by.name('current')).sendKeys('admin')
        element(by.name('password')).sendKeys('instruct')
        element(by.name('passwordRepeat')).sendKeys('instruct')
        element(by.id('update')).click();
        
        browser.driver.sleep(300);
        expect(element.all(by.id('modal-body')).count()).toBe(0);
        utils.Logout();
        expect(element.all(by.id('login')).count() === 0);

        utils.Login('instruct', 'instruct');
        expect(element.all(by.id('login')).count() !== 0);

        element(by.id('account')).click();
        browser.driver.sleep(1);
        element(by.id('changePass')).click()
        browser.driver.sleep(1);
        element(by.name('current')).sendKeys('instruct')
        element(by.name('password')).sendKeys('admin')
        element(by.name('passwordRepeat')).sendKeys('admin')
        element(by.id('update')).click();
    });

    it('Test admin can see manage user button in dropdown', function() {
        utils.Login('admin', 'admin');

        element(by.id('account')).click();
        browser.driver.sleep(1);
        expect(element.all(by.id('manageAccounts')).count()).toBe(1);
    });
});