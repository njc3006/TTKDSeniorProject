(function() {
    var Logout = function() {
        element(by.id('account')).click();
        browser.driver.sleep(1);
        element(by.id('logout')).click();
        browser.driver.sleep(3000);
    };

    var Login = function(username, password) {
        element.all(by.id('login')).click();
        browser.driver.sleep(1000);

        element(by.name('username')).sendKeys(username);
        element(by.name('password')).sendKeys(password);
        element(by.id('loginBtn')).click();

        browser.driver.sleep(3000);
    };
}());
