(function() {

  angular.module('ttkdApp.programsCtrl', ['ttkdApp.constants'])

    .controller('ProgramsCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ProgramsSvc', 
        function($scope, $rootScope, $state, $stateParams, ProgramsSvc) {
        $rootScope.showCurrentProgram = !$stateParams.hideCurrentProgram;

        $scope.programs = [];
        $scope.alerts = {
            loaded : false,
            error : false,
            success: false
        };

        $scope.getPrograms = function(){
            ProgramsSvc.getPrograms().then(
                function(response){
                    $scope.programs = response.data;
                    $scope.alerts.loaded = true;
                }, function(error){
                    $scope.alerts.loaded = true;
                    $scope.alerts.error = true;
                });
        };

        $scope.checkActiveFlag = function(programs, successCase){
            for(var i = 0; i < programs.length; i++){
                if(programs[i]['active'] === successCase){
                    return true;
                }
            }
            return false;
        };

        $scope.editProgram = function(program) {
            $state.go('editProgram', ({curProgram: program}))
        };

        $scope.getPrograms();

    }])

    .filter('reverse', function() {
      return function(items) {
        return items.slice().reverse();
      };
    });
})();