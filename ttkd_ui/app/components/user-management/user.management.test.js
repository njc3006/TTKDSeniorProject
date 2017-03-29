// Describe the group of tests

describe('User Management', function () {

    beforeEach(() => {
        browser.driver.sleep(100);
        browser.get(browser.params.appUrl);
        browser.driver.sleep(100);
    });

    afterEach(() => {
        element(by.id('userBtn')).click();
        browser.driver.sleep(1);
        element(by.id('logout')).click();
    });

    it('Test login errors', function() {
        
        element(by.id('login')).click();
        element(by.id('username')).sendKeys('admin');
        element(by.id('loginBtn')).click();
        browser.driver.sleep(100);

        expect(element.all(by.id('invalidCreds')).count()).toBe(0);
        expect(element.all(by.id('missingFields')).count()).toBe(1);
        element(by.id('password')).sendKeys('instruct');
        element(by.id('loginBtn')).click();
        browser.driver.sleep(100);

        expect(element.all(by.id('invalidCreds')).count()).toBe(1);
        expect(element.all(by.id('missingFields')).count()).toBe(0);
        element(by.id('password')).clear().then(function() {
            element(by.id('password')).sendKeys('admin');
        })
        element(by.id('loginBtn')).click();
        browser.driver.sleep(100);

        expect(element.all(by.id('invalidCreds')).count()).toBe(0);
        expect(element.all(by.id('missingFields')).count()).toBe(0);

        //Login('admin', 'admin');
    });

    it('Test admin create new user', function() {
        
        element(by.id('login')).click();
        element(by.id('username')).sendKeys('admin');
        element(by.id('password')).sendKeys('admin');
        element(by.id('loginBtn')).click();

        //Login('admin', 'admin');

        element(by.id('userBtn')).click();
        browser.driver.sleep(1);
        expect(element.all(by.id('manageAccounts')).count()).toBe(1);
        element(by.id('manageAccounts')).click();
        // Make sure we are on the correct page.
        var userManagement = element.all(by.xpath('//h1[contains(text(),\'User List\')]')).count();
        expect(userManagement).toBe(1);


    });

    it('Test instructor can not see manage user button in dropdown', function() {
        
        element(by.id('login')).click();
        element(by.id('username')).sendKeys('instruct');
        element(by.id('password')).sendKeys('admin');
        element(by.id('loginBtn')).click();

        //Login('instruct', 'admin');

        element(by.id('userBtn')).click();
        browser.driver.sleep(1);
        expect(element.all(by.id('manageAccounts')).count()).toBe(0);
        element(by.id('userBtn')).click();  
    });

    it('Test instructor can change own password', function() {
        
        element(by.id('login')).click();
        element(by.id('username')).sendKeys('instruct');
        element(by.id('password')).sendKeys('admin');
        element(by.id('loginBtn')).click();

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
        
        element(by.id('userBtn')).click();
        browser.driver.sleep(1);
        element(by.id('logout')).click();

        expect(element.all(by.id('login')).count()).toBe(1);
        
        element(by.id('login')).click();
        element(by.id('username')).sendKeys('instruct');
        element(by.id('password')).sendKeys('instruct');
        element(by.id('loginBtn')).click();

        expect(element.all(by.id('login')).count()).toBe(0);

        element(by.id('userBtn')).click();
        browser.driver.sleep(1);
        element(by.id('changePass')).click()
        browser.driver.sleep(1);
        element(by.name('current')).sendKeys('instruct')
        element(by.name('password')).sendKeys('admin')
        element(by.name('passwordRepeat')).sendKeys('admin')
        element(by.id('update')).click();
    });

    it('Test admin can change own password', function() {
        
        element(by.id('login')).click();
        element(by.id('username')).sendKeys('admin');
        element(by.id('password')).sendKeys('admin');
        element(by.id('loginBtn')).click();

        element(by.id('userBtn')).click();
        browser.driver.sleep(1);
        element(by.id('changePass')).click()
        browser.driver.sleep(1);
        element(by.name('current')).sendKeys('admin')
        element(by.name('password')).sendKeys('instruct')
        element(by.name('passwordRepeat')).sendKeys('instruct')
        element(by.id('update')).click();
        
        // Make sure the modal closed
        browser.driver.sleep(300);
        expect(element.all(by.id('modal-body')).count()).toBe(0);
        
        element(by.id('userBtn')).click();
        browser.driver.sleep(1);
        element(by.id('logout')).click();

        expect(element.all(by.id('login')).count()).toBe(1);
        
        element(by.id('login')).click();
        element(by.id('username')).sendKeys('admin');
        element(by.id('password')).sendKeys('instruct');
        element(by.id('loginBtn')).click();

        expect(element.all(by.id('login')).count()).toBe(0);

        element(by.id('userBtn')).click();
        browser.driver.sleep(1);
        element(by.id('changePass')).click()
        browser.driver.sleep(1);
        element(by.name('current')).sendKeys('instruct')
        element(by.name('password')).sendKeys('admin')
        element(by.name('passwordRepeat')).sendKeys('admin')
        element(by.id('update')).click();
    });

});