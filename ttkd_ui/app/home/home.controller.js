(function() {

  angular.module('ttkdApp.homeCtrl', [])
    .controller('HomeCtrl', ['$scope', '$uibModal', '$document', 'ProgramsSvc',
     function($scope, $uibModal, $document, ProgramsSvc) {

    	var modalInstance;
     	$scope.programs = [];

    	$scope.openChangeProgram = function() {
			var modalElement = angular.element($document[0].querySelector('#change-program-modal'));
    		modalInstance = $uibModal.open({
    			animation: true,
    			ariaLabelledBy: 'modal-title',
    			ariaDescribedBy: 'modal-body',
    			templateUrl: 'home/choose-program.modal.html',
    			scope: $scope
    		});
    	};

    	$scope.selectProgram = function(program) {
    		$scope.changeProgram(program);
    		$scope.closeChangeProgram();
    	};

    	$scope.closeChangeProgram = function() {
    		modalInstance.dismiss('no');
    	};

    	//initialization
		ProgramsSvc.getActivePrograms().then(function onSuccess(response) {
			$scope.programs = response.data;
		});

    }]);

})();
