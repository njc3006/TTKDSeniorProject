// Configuration for Protractor.js Test Framework
exports.config = {
  seleniumServerJar: './node_modules/gulp-protractor/node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-2.53.1.jar',
  specs: ['app/components/**/*.test.js'],
  params: {
    appUrl: 'http://localhost:3000/#!/checkin/1',
		registrationUrl: 'http://localhost:3000/#!/registration'
  },
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['--disable-web-security']
    }
  }
};
