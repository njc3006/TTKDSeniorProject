(function() {
  function StudentProgramsController($scope, SharedDataService, StudentsSvc) {
    var studentId = SharedDataService.getStudentId();
    $scope.programs = [];

    StudentsSvc.getStudentRegistrations(studentId).then(
      function(response) {
        $scope.programs = response.data;
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
