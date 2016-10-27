(function() {

  angular.module('ttkdApp.mainCtrl', [])
    .controller('MainCtrl', ['$scope', 'ProgramsSvc', 'defaultProgramId', 
    	function($scope, ProgramsSvc, defaultProgramId) {
      $scope.showNav = true;
      $scope.title = 'Tioga Tae Kwon Do';
      
      //get the default active program
      ProgramsSvc.getProgram(defaultProgramId).then(function onSuccess(response) {
      	$scope.currentProgram = response.data;
      });
    }]);

})();
