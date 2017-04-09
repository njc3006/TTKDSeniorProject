(function() {

  angular.module('ttkdApp.homeCtrl', [])
    .controller('HomeCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$uibModal',
        '$document', 'ProgramsSvc', 'CheckinService',
     function($scope, $rootScope, $state, $stateParams, $uibModal, $document, ProgramsSvc, CheckinService) {
        $rootScope.showCurrentProgram = $stateParams.showCurrentProgram;

    	var modalInstance;
     	$scope.programs = [];

        var getActivePrograms = function() {
            ProgramsSvc.getActivePrograms().then(function onSuccess(response) {
                $scope.programs = response.data;
            });
        };

				$scope.goToPage = function(page, data) {
					$state.go(page, data);
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
    		modalInstance.dismiss('no');
    	};

    	$scope.updateCheckinMode = function(){
    	    CheckinService.setCheckinMode('Checkin');
         };

    	//initialization
        getActivePrograms();

    }]);

})();
