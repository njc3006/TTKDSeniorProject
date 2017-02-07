describe('CheckinService Test', function() {
  var CheckinService;

  // This loads the angular module that CheckinService is located in before each test
  beforeEach(angular.mock.module('ttkdApp.checkinSvc'));

  // This loads the service that we want to test (CheckinService) before each test
  beforeEach(inject(function(_CheckinService_) {
      CheckinService = _CheckinService_;
  }));//end beforeEach

  // This is a test checking that 
  it("Students exist in class", function() {
    // Get students from program with ID=1
    CheckinService.getStudentsFromClass(1).then(function(response) {
      expect(response.data.length > 0).toBe(true);
    });
  });
});
