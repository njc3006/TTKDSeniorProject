(function() {

  angular.module('ttkdApp.mainCtrl', ['ttkdApp.constants'])
    .controller('MainCtrl', ['$scope', 'companyName', 'ProgramsSvc',
    	function($scope, companyName, ProgramsSvc) {
      $scope.showNav = true;
      $scope.title = companyName;

      // get all the active programs, then set the first one in the list to our default
      ProgramsSvc.getActivePrograms().then(function onSuccess(response) {
        if(response && response.data.length > 0) {
      	  $scope.currentProgram = response.data[0];
        }
      });

      $scope.changeProgram = function(program) {
        $scope.currentProgram = program;
      };

    }]);

})();
