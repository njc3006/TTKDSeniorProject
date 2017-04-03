(function() {

  angular.module('ttkdApp.mainCtrl', ['ttkdApp.constants', 'ngCookies'])
    .controller('MainCtrl', ['$scope', 'companyName', 'ProgramsSvc', '$cookies', '$location',
    	function($scope, companyName, ProgramsSvc, $cookies, $location) {
      $scope.showNav = true;
      $scope.title = companyName;

      // get all the active programs, then set the first one in the list to our default
      if(!$cookies.getObject('currentProgram')) {
        ProgramsSvc.getActivePrograms().then(function onSuccess(response) {
          if(response && response.data.length > 0) {
        	  $cookies.putObject('currentProgram', response.data[0]);
          }
        });
      }
      else {
        $scope.currentProgram = $cookies.getObject('currentProgram');

        // Update our info if another tablet changed the info.
        ProgramsSvc.getProgram($scope.currentProgram.id).then(function onSuccess(response) {
          $cookies.putObject('currentProgram', response.data);
          $scope.currentProgram = $cookies.getObject('currentProgram');
        });
      }

      $scope.changeProgram = function(program) {
        $scope.currentProgram = program;
        $cookies.putObject('currentProgram', program);
        location.reload();
      };

    }]);

})();
