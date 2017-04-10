(function() {

  angular.module('ttkdApp.programsCtrl', ['ttkdApp.constants'])

    .controller('ProgramsCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$uibModal', '$document', 'ProgramsSvc', 
        function($scope, $rootScope, $state, $stateParams, $uibModal, $document, ProgramsSvc) {
        $rootScope.showCurrentProgram = $stateParams.showCurrentProgram;

        var modalInstance;

        $scope.programs = [];
        $scope.addProgramMessage = {};
        $scope.newProgram = '';
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

        $scope.openAddProgram = function() {
            $scope.addProgramMessage = {};
            modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'components/programs/add-program.modal.html',
                scope: $scope
            });
        };

        /* add the typed in program */
        $scope.addProgram = function(program) {
            if(program !== '') {
                var postData = {name: program};
                ProgramsSvc.postNewProgram(postData).then(
                    function onSuccess(response) {
                        $scope.addProgramMessage = {success: 'Successfuly added ' + program + '.'};
                        $scope.newProgram = '';
                        $scope.getPrograms();
                        $scope.closeModal();
                    }, function onFailure(response) {
                        $scope.addProgramMessage = {
                            error: 'Failed to add ' + program + '. Please make sure this program does not already exist.'
                        };
                        $scope.newProgram = '';
                    });
            }
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

        $scope.closeModal = function() {
            modalInstance.close();
        };

        $scope.getPrograms();

    }])

    .filter('reverse', function() {
      return function(items) {
        return items.slice().reverse();
      };
    });
})();