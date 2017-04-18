(function() {
  function StudentProgramsController($scope, SharedDataService, StudentsSvc) {
    var studentPromise = SharedDataService.getActiveStudent();
    $scope.programs = [];

    studentPromise.then(
      function(student) {
        StudentsSvc.getStudentRegistrations(student.id).then(
          function(response) {
            $scope.programs = response.data;
          });
      });

  }

  angular.module('ttkdApp.studentDetailCtrl')
    .controller('StudentProgramsCtrl', [
      '$scope',
      'SharedDataSvc',
      'StudentsSvc',
      StudentProgramsController
    ]);
})();
