describe('CheckinService Test', function() {
  var CheckinService;

  // Before each test load our api.users module
  beforeEach(angular.mock.module('ttkdApp.checkinSvc'));

  // Before each test set our injected service to our local service variable
  beforeEach(inject(function(_CheckinService_) {
      CheckinService = _CheckinService_;
  }));//end beforeEach

  it("Students exist in class", function() {
    console.log(CheckinService);
    CheckinService.getStudentsFromClass(1);
  });
});
