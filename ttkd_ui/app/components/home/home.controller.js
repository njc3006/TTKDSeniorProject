(function() {

  angular.module('ttkdApp.homeCtrl', [])
    .controller('HomeCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$uibModal',
        '$document', '$cookies', 'ProgramsSvc', 'CheckinService',
     function($scope, $rootScope, $state, $stateParams, $uibModal, $document, $cookies, ProgramsSvc, CheckinService) {
        $rootScope.showCurrentProgram = $stateParams.showCurrentProgram;

    	var modalInstance;
     	$scope.programs = [];
        //programs entered into the add program modal field will be temporarily stored here
        $scope.newProgram = '';
        //messages to be relayed to user when adding programs
        $scope.addProgramMessage = {};

        $scope.currentProgram = $cookies.getObject('currentProgram');

        var getActivePrograms = function() {
            ProgramsSvc.getActivePrograms().then(function onSuccess(response) {
                $scope.programs = response.data;
            });
        };

		$scope.goToPage = function(page, data) {
			$state.go(page, data);
		};

        $scope.openAddProgram = function() {
            $scope.addProgramMessage = {};
            var modalElement = angular.element($document[0].querySelector('#modal-area'));
            modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'components/home/add-program.modal.html',
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
                        getActivePrograms();
                    }, function onFailure(response) {
                        $scope.addProgramMessage = {
                            error: 'Failed to add ' + program +
                            '. Please make sure this program does not already exist.'
                        };
                        $scope.newProgram = '';
                    });
            }
        };

    	$scope.openChangeProgram = function() {
            getActivePrograms();
            var modalElement = angular.element($document[0].querySelector('#modal-area'));
            modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'components/home/choose-program.modal.html',
                scope: $scope
            });
    	};

    	$scope.selectProgram = function(program) {
    		$scope.changeProgram(program);
    		$scope.closeModal();
    	};

    	$scope.closeModal = function() {
    		modalInstance.close();
    	};

    	$scope.updateCheckinMode = function(){
    	    CheckinService.setCheckinMode('Checkin');
         };

    	//initialization
        getActivePrograms();

    }]);

})();
