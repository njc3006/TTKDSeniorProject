(function() {
  function StudentProgramsController($scope, SharedDataService, StudentsSvc, ProgramsSvc) {
    var studentId = SharedDataService.getStudentId();
    $scope.programs = [];

    //initialize list of all programs, then map the programs a student is enrolled in to program names
    var programs = {};
    ProgramsSvc.getPrograms().then(
      function (response) {

        // create a dictionary mapping each program id to it's name
        angular.forEach(response.data, function(program) {
          programs[program.id] = program.name;
        });

        // start the call to get student registrations from in here so our program list is populated
        StudentsSvc.getStudentRegistrations(studentId).then(
          function(response) {
            $scope.programs = response.data.map(function(registration){
              return programs[registration.program];
            });
        });

      });


  }

  angular.module('ttkdApp.studentDetailCtrl')
    .controller('StudentProgramsCtrl', [
      '$scope',
      'SharedDataSvc',
      'StudentsSvc',
      'ProgramsSvc',
      StudentProgramsController
    ]);
})();
