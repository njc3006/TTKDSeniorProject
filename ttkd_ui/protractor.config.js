// Configuration for Protractor.js Test Framework
exports.config = {
  seleniumServerJar: './node_modules/gulp-protractor/node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-2.53.1.jar',
  specs: ['app/**/*.test.js'],
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['--disable-web-security']
    }
  }
};