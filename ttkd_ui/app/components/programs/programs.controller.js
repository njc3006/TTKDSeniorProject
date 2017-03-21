(function() {

  angular.module('ttkdApp.programsCtrl', ['ttkdApp.constants'])

    .controller('ProgramsCtrl', ['$scope', '$rootScope', '$stateParams', '$document', '$uibModal', 'ProgramsSvc', 
        function($scope, $rootScope, $stateParams, $document, $uibModal, ProgramsSvc) {
        $rootScope.showCurrentProgram = !$stateParams.hideCurrentProgram;

        $scope.programs = [];
        $scope.curProgram = {};
        $scope.editProgramAlert = {};

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
            $scope.curProgram = program;
            $scope.editProgramAlert = {};
            $scope.alerts.success = false;

            var modalElement = angular.element($document[0].querySelector('#modal-area'));
            modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'components/programs/edit-program.modal.html',
                scope: $scope
            });
        };

        $scope.updateProgram = function(program) {
            if(program) {
                ProgramsSvc.updateProgram(program, program.id).then(
                    function(response){
                        $scope.curProgram = {};
                        $scope.alerts.success = true;
                        $scope.closeModal();
                    }, function(error){
                        $scope.editProgramAlert = { error : 'Failed to update ' + program.name + '.' };
                        $scope.alerts.success = false;
                    });
            }
        };

        $scope.closeModal = function() {
            modalInstance.close();
        };

        $scope.getPrograms();

    }]);

})();