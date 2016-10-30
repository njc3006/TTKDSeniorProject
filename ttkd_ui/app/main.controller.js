(function() {

  angular.module('ttkdApp.mainCtrl', [])
    .controller('MainCtrl', ['$scope', 'ProgramsSvc', 
    	function($scope, ProgramsSvc) {
      $scope.showNav = true;
      $scope.title = 'Tioga Tae Kwon Do';
      
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
