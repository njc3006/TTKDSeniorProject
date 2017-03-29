// Describe the group of tests
var Logout = function() {
    element(by.id('userBtn')).click();
    browser.driver.sleep(1);
    element(by.id('logout')).click();
    browser.driver.sleep(1000);
};

var Login = function(username, password) {
    element.all(by.id('login')).click();
    browser.driver.sleep(1000);

    element(by.name('username')).sendKeys(username);
    element(by.name('password')).sendKeys(password);
    element(by.id('loginBtn')).click();

    browser.driver.sleep(1000);
};

describe('User Management', function () {

    beforeEach(() => {
        browser.get(browser.params.appUrl);
        if(element.all(by.id('login')).count() !== 0) {
            Logout();
        }
    });

    afterEach(() => {
    });

    it('Test instructor can change own password', function() {
        Login('instruct', 'admin');

        element(by.id('userBtn')).click();
        browser.driver.sleep(1);
        element(by.id('changePass')).click()
        browser.driver.sleep(1);
        element(by.name('current')).sendKeys('admin')
        element(by.name('password')).sendKeys('instruct')
        element(by.name('passwordRepeat')).sendKeys('instruct')
        element(by.id('update')).click();
        
        browser.driver.sleep(300);
        expect(element.all(by.id('modal-body')).count()).toBe(0);
        Logout();
        expect(element.all(by.id('login')).count() === 0);

        Login('instruct', 'instruct');
        expect(element.all(by.id('login')).count() !== 0);

        element(by.id('userBtn')).click();
        browser.driver.sleep(1);
        element(by.id('changePass')).click()
        browser.driver.sleep(1);
        element(by.name('current')).sendKeys('instruct')
        element(by.name('password')).sendKeys('admin')
        element(by.name('passwordRepeat')).sendKeys('admin')
        element(by.id('update')).click();
    });

    it('Test admin can see manage user button in dropdown', function() {
        Login('admin', 'admin');

        element(by.id('userBtn')).click();
        browser.driver.sleep(1);
        expect(element.all(by.id('manageAccounts')).count()).toBe(1);
    });

    it('Test instructor can not see manage user button in dropdown', function() {
        Login('instruct', 'admin');
        browser.driver.sleep(10000);
        element(by.id('userBtn')).click();
        console.log('We got here');
        browser.driver.sleep(10000);
        browser.driver.sleep(1);
        expect(element.all(by.id('manageAccounts')).count()).toBe(0);
    });
});