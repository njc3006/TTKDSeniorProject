// Describe the group of tests
describe('Student Checkin', function() {

  beforeEach(() => {
    browser.get('http://localhost:3000/#/checkin/1');
  });

  it('There is at least one unchecked in student', function() {
    // select the first student by getting the first element with the .unchecked css class
    var numUnchecked = element.all(by.css('.unchecked')).count();
    // verify that we retrieved a student
    expect(numUnchecked).toBeGreaterThan(0);
  });

  // define a test to run
  it('Check someone in to program 1', function() {
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
    element.all(by.css('.checked')).count().then(function(oldNumChecked) {
      // click the yes button
      yesBtn.click();
      browser.driver.sleep(1);
      browser.waitForAngular();
      // verify student was checked in
      element.all(by.css('.checked')).count().then(function(newNumChecked) {
        expect(newNumChecked).toEqual(oldNumChecked+1);
      });
    });
  });

  it('Make sure a student can\'t uncheck somebody', function() {
    // get a checked in student
    var checkedStudent = element.all(by.css('.checked')).first();

    // make sure the person exists
    expect(checkedStudent.isPresent()).toBeTruthy();

    checkedStudent.getCssValue('pointer-events').then(function(value) {
      expect(value).toEqual('none');
    });
  });

});