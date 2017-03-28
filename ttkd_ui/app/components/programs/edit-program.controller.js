(function() {

  angular.module('ttkdApp.editProgramCtrl', ['ttkdApp.constants'])

    .controller('EditProgramCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ProgramsSvc', 
        function($scope, $rootScope, $state, $stateParams, ProgramsSvc) {
        $rootScope.showCurrentProgram = !$stateParams.hideCurrentProgram;

        $scope.program = $stateParams.curProgram;
        $scope.alerts = {
            success: false,
            error : false
        };

        $scope.updateProgram = function() {
            $scope.clearAlerts();

            if($scope.program) {
                ProgramsSvc.updateProgram($scope.program, $scope.program.id).then(
                    function(response){
                        // $state.go('editPrograms');
                        $scope.alerts.success = true;
                    }, function(error){
                        $scope.alerts.error = true;
                    });
            }
        };

        $scope.clearAlerts = function() {
            $scope.alerts.success = false;
            $scope.alerts.error = false;
        };

        $scope.backNavigate = function() {
            $state.go('editPrograms');
        };

    }]);
})();