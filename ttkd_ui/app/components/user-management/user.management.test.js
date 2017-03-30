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
        });
        element(by.id('loginBtn')).click();
        browser.driver.sleep(100);

        expect(element.all(by.id('invalidCreds')).count()).toBe(0);
        expect(element.all(by.id('missingFields')).count()).toBe(0);

        //Login('admin', 'admin');
    });

    it('Test admin create and delete new user', function() {
        
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

        element(by.id('createUser')).click();
        browser.driver.sleep(1);
        expect(element.all(by.id('failureError')).count()).toBe(0);
        expect(element.all(by.id('missingError')).count()).toBe(0);
        expect(element.all(by.id('passwordError')).count()).toBe(0);
        expect(element.all(by.id('customError')).count()).toBe(0);
        // Ensure the modal is in the correct mode
        var createUser = element.all(by.xpath('//h3[contains(text(),\'Create New User\')]')).count();
        expect(createUser).toBe(1);
        
        element(by.id('create')).click();
        expect(element.all(by.id('failureError')).count()).toBe(0);
        expect(element.all(by.id('missingError')).count()).toBe(0);
        expect(element.all(by.id('passwordError')).count()).toBe(0);
        expect(element.all(by.id('customError')).count()).toBe(0);

        element(by.id('username')).sendKeys('New User');
        element(by.id('password')).sendKeys('testpass');
        element(by.id('confirmation')).sendKeys('New User');
        element(by.id('create')).click();
        expect(element.all(by.id('failureError')).count()).toBe(0);
        expect(element.all(by.id('missingError')).count()).toBe(0);
        expect(element.all(by.id('passwordError')).count()).toBe(1);
        expect(element.all(by.id('customError')).count()).toBe(0);

        element(by.id('confirmation')).clear().then(function() {
            element(by.id('confirmation')).sendKeys('testpass');
        });
        element(by.id('create')).click();
        expect(element.all(by.id('failureError')).count()).toBe(0);
        expect(element.all(by.id('missingError')).count()).toBe(0);
        expect(element.all(by.id('passwordError')).count()).toBe(0);
        expect(element.all(by.id('customError')).count()).toBe(1);

        element(by.id('username')).clear().then(function() {
            element(by.id('username')).sendKeys('1User');
        });
        element(by.id('create')).click();
        expect(element.all(by.id('failureError')).count()).toBe(0);
        expect(element.all(by.id('missingError')).count()).toBe(0);
        expect(element.all(by.id('passwordError')).count()).toBe(0);
        expect(element.all(by.id('customError')).count()).toBe(0);
        
        // Ensure new user was created
        var newUser = element.all(by.xpath('//h4[contains(text(),\'1User\')]')).count();
        expect(newUser).toBe(1);

        // Try to create a duplicate user
        element(by.id('createUser')).click();
        element(by.id('username')).sendKeys('1User');
        element(by.id('password')).sendKeys('testpass');
        element(by.id('confirmation')).sendKeys('testpass');
        element(by.id('create')).click();
        expect(element.all(by.id('failureError')).count()).toBe(0);
        expect(element.all(by.id('missingError')).count()).toBe(0);
        expect(element.all(by.id('passwordError')).count()).toBe(0);
        expect(element.all(by.id('customError')).count()).toBe(1);
        element(by.id('cancel-action')).click();

        element(by.id('delete-user-1User')).click();
        element(by.id('delete-yes')).click();

        var newUser = element.all(by.xpath('//h4[contains(text(),\'1User\')]')).count();
        expect(newUser).toBe(0);
    });

    it('Test admin updating another user', function() {
        
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
        expect(element.all(by.xpath('//h1[contains(text(),\'User List\')]')).count()).toBe(1);

        element(by.id('edit-user-instruct')).click();
        browser.driver.sleep(1);
        expect(element.all(by.id('failureError')).count()).toBe(0);
        expect(element.all(by.id('missingError')).count()).toBe(0);
        expect(element.all(by.id('passwordError')).count()).toBe(0);
        expect(element.all(by.id('customError')).count()).toBe(0);
        // Ensure the modal is in the correct mode
        expect(element.all(by.xpath('//h3[contains(text(),\'Modifying instruct\')]')).count()).toBe(1);

        element(by.id('username')).clear().then(function() {
            element(by.id('username')).sendKeys('instructor 1');
        });
        element(by.id('update')).click();
        expect(element.all(by.id('failureError')).count()).toBe(0);
        expect(element.all(by.id('missingError')).count()).toBe(0);
        expect(element.all(by.id('passwordError')).count()).toBe(0);
        expect(element.all(by.id('customError')).count()).toBe(1);

        element(by.id('username')).clear().then(function() {
            element(by.id('username')).sendKeys('admin');
        });
        element(by.id('update')).click();
        expect(element.all(by.id('failureError')).count()).toBe(0);
        expect(element.all(by.id('missingError')).count()).toBe(0);
        expect(element.all(by.id('passwordError')).count()).toBe(0);
        expect(element.all(by.id('customError')).count()).toBe(1);

        element(by.id('username')).clear().then(function() {
            element(by.id('username')).sendKeys('instructor');
        });
        element(by.id('admin')).click();
        element(by.id('update')).click();
        expect(element.all(by.id('failureError')).count()).toBe(0);
        expect(element.all(by.id('missingError')).count()).toBe(0);
        expect(element.all(by.id('passwordError')).count()).toBe(0);
        expect(element.all(by.id('customError')).count()).toBe(0);
        expect(element.all(by.id('success')).count()).toBe(1);
        
        // Ensure user was modified
        expect(element.all(by.xpath('//h4[contains(text(),\'instructor\')]')).count()).toBe(1);
        expect(element.all(by.xpath('//h4[contains(text(),\'Yes\')]')).count()).toBe(2);

        // Return the system state
        element(by.id('edit-user-instructor')).click();
        element(by.id('username')).clear().then(function() {
            element(by.id('username')).sendKeys('instruct');
        });
        element(by.id('admin')).click();
        element(by.id('update')).click();
        expect(element.all(by.id('failureError')).count()).toBe(0);
        expect(element.all(by.id('missingError')).count()).toBe(0);
        expect(element.all(by.id('passwordError')).count()).toBe(0);
        expect(element.all(by.id('customError')).count()).toBe(0);
        expect(element.all(by.id('success')).count()).toBe(1);
        
        // Ensure state was reset
        expect(element.all(by.id('modal-body')).count()).toBe(0);
        expect(element.all(by.xpath('//h4[contains(text(),\'instructor\')]')).count()).toBe(0);
        expect(element.all(by.xpath('//h4[contains(text(),\'Yes\')]')).count()).toBe(1);
    });

    it('Test admin resetting another\'s password', function() {
        
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
        expect(element.all(by.xpath('//h1[contains(text(),\'User List\')]')).count()).toBe(1);

        element(by.id('set-password-instruct')).click();
        browser.driver.sleep(1);
        expect(element.all(by.id('failureError')).count()).toBe(0);
        expect(element.all(by.id('missingError')).count()).toBe(0);
        expect(element.all(by.id('passwordError')).count()).toBe(0);
        expect(element.all(by.id('currentPasswordError')).count()).toBe(0);
        expect(element.all(by.id('success')).count()).toBe(0);
        // Ensure the modal is in the correct mode
        expect(element.all(by.xpath('//h3[contains(text(),\'Set password for instruct\')]')).count()).toBe(1);

        element(by.id('current')).sendKeys('instruct');
        element(by.id('update')).click();
        expect(element.all(by.id('failureError')).count()).toBe(0);
        expect(element.all(by.id('missingError')).count()).toBe(0);
        expect(element.all(by.id('passwordError')).count()).toBe(0);
        expect(element.all(by.id('currentPasswordError')).count()).toBe(0);
        expect(element.all(by.id('success')).count()).toBe(0);

        element(by.id('password')).sendKeys('instruct');
        element(by.id('confirmation')).sendKeys('admin');

        element(by.id('update')).click();
        expect(element.all(by.id('failureError')).count()).toBe(0);
        expect(element.all(by.id('missingError')).count()).toBe(0);
        expect(element.all(by.id('passwordError')).count()).toBe(1);
        expect(element.all(by.id('currentPasswordError')).count()).toBe(0);
        expect(element.all(by.id('success')).count()).toBe(0);

        element(by.id('confirmation')).clear().then(function() {
            element(by.id('confirmation')).sendKeys('instruct');
        });
        element(by.id('update')).click();
        expect(element.all(by.id('failureError')).count()).toBe(0);
        expect(element.all(by.id('missingError')).count()).toBe(0);
        expect(element.all(by.id('passwordError')).count()).toBe(0);
        expect(element.all(by.id('currentPasswordError')).count()).toBe(1);
        expect(element.all(by.id('success')).count()).toBe(0);

        element(by.id('current')).clear().then(function() {
            element(by.id('current')).sendKeys('admin');
        });
        element(by.id('update')).click();
        expect(element.all(by.id('failureError')).count()).toBe(0);
        expect(element.all(by.id('missingError')).count()).toBe(0);
        expect(element.all(by.id('passwordError')).count()).toBe(0);
        expect(element.all(by.id('currentPasswordError')).count()).toBe(0);
        expect(element.all(by.id('success')).count()).toBe(1);
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

        expect(element.all(by.xpath('//h3[contains(text(),\'Change Your Password\')]')).count()).toBe(1);
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
        
        // Insure the modal is in the correct format
        expect(element.all(by.xpath('//h3[contains(text(),\'Change Your Password\')]')).count()).toBe(1);
        
        element(by.id('current')).sendKeys('instruct');
        element(by.id('update')).click();
        expect(element.all(by.id('failureError')).count()).toBe(0);
        expect(element.all(by.id('missingError')).count()).toBe(0);
        expect(element.all(by.id('passwordError')).count()).toBe(0);
        expect(element.all(by.id('currentPasswordError')).count()).toBe(0);
        expect(element.all(by.id('success')).count()).toBe(0);

        element(by.id('password')).sendKeys('instruct');
        element(by.id('confirmation')).sendKeys('admin');

        element(by.id('update')).click();
        expect(element.all(by.id('failureError')).count()).toBe(0);
        expect(element.all(by.id('missingError')).count()).toBe(0);
        expect(element.all(by.id('passwordError')).count()).toBe(1);
        expect(element.all(by.id('currentPasswordError')).count()).toBe(0);

        element(by.id('confirmation')).clear().then(function() {
            element(by.id('confirmation')).sendKeys('instruct');
        });
        element(by.id('update')).click();
        expect(element.all(by.id('failureError')).count()).toBe(0);
        expect(element.all(by.id('missingError')).count()).toBe(0);
        expect(element.all(by.id('passwordError')).count()).toBe(0);
        expect(element.all(by.id('currentPasswordError')).count()).toBe(1);

        element(by.id('current')).clear().then(function() {
            element(by.id('current')).sendKeys('admin');
        });
        element(by.id('update')).click();
        expect(element.all(by.id('failureError')).count()).toBe(0);
        expect(element.all(by.id('missingError')).count()).toBe(0);
        expect(element.all(by.id('passwordError')).count()).toBe(0);
        expect(element.all(by.id('currentPasswordError')).count()).toBe(0);
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

    it('Test instructor can change own password', function() {
        
        element(by.id('login')).click();
        element(by.id('username')).sendKeys('instruct');
        element(by.id('password')).sendKeys('admin');
        element(by.id('loginBtn')).click();

        element(by.id('userBtn')).click();
        browser.driver.sleep(1);
        element(by.id('changePass')).click()
        browser.driver.sleep(1);
        
        // Insure the modal is in the correct format
        expect(element.all(by.xpath('//h3[contains(text(),\'Change Your Password\')]')).count()).toBe(1);
        
        element(by.id('current')).sendKeys('instruct');
        element(by.id('update')).click();
        expect(element.all(by.id('failureError')).count()).toBe(0);
        expect(element.all(by.id('missingError')).count()).toBe(0);
        expect(element.all(by.id('passwordError')).count()).toBe(0);
        expect(element.all(by.id('currentPasswordError')).count()).toBe(0);
        expect(element.all(by.id('success')).count()).toBe(0);

        element(by.id('password')).sendKeys('instruct');
        element(by.id('confirmation')).sendKeys('admin');

        element(by.id('update')).click();
        expect(element.all(by.id('failureError')).count()).toBe(0);
        expect(element.all(by.id('missingError')).count()).toBe(0);
        expect(element.all(by.id('passwordError')).count()).toBe(1);
        expect(element.all(by.id('currentPasswordError')).count()).toBe(0);

        element(by.id('confirmation')).clear().then(function() {
            element(by.id('confirmation')).sendKeys('instruct');
        });
        element(by.id('update')).click();
        expect(element.all(by.id('failureError')).count()).toBe(0);
        expect(element.all(by.id('missingError')).count()).toBe(0);
        expect(element.all(by.id('passwordError')).count()).toBe(0);
        expect(element.all(by.id('currentPasswordError')).count()).toBe(1);

        element(by.id('current')).clear().then(function() {
            element(by.id('current')).sendKeys('admin');
        });
        element(by.id('update')).click();
        expect(element.all(by.id('failureError')).count()).toBe(0);
        expect(element.all(by.id('missingError')).count()).toBe(0);
        expect(element.all(by.id('passwordError')).count()).toBe(0);
        expect(element.all(by.id('currentPasswordError')).count()).toBe(0);
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

    it('Make sure users that arent admins are bounced from the user management page', function() {
        
        browser.get(browser.params.appUrl + 'user-management');
        browser.driver.sleep(100);

        // Make sure we aren't on the user management page.
        var userManagement = element.all(by.xpath('//h1[contains(text(),\'User List\')]')).count();
        expect(userManagement).toBe(0);

        element(by.id('login')).click();
        element(by.id('username')).sendKeys('instruct');
        element(by.id('password')).sendKeys('admin');
        element(by.id('loginBtn')).click();
        browser.driver.sleep(500);

        browser.get(browser.params.appUrl + 'user-management');
        browser.driver.sleep(100);

        // Make sure we aren't on the user management page.
        var userManagement = element.all(by.xpath('//h1[contains(text(),\'User List\')]')).count();
        expect(userManagement).toBe(0);
    });

});