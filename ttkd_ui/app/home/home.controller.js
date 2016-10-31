(function() {

  angular.module('ttkdApp.homeCtrl', [])
    .controller('HomeCtrl', ['$scope', '$uibModal', '$document', 'ProgramsSvc',
     function($scope, $uibModal, $document, ProgramsSvc) {

    	var modalInstance;
     	$scope.programs = [];
        //programs entered into the add program modal field will be temporarily stored here
        $scope.newProgram = '';
        //messages to be relayed to user when adding programs
        $scope.addProgramMessage = {};

        $scope.openAddProgram = function() {
            var modalElement = angular.element($document[0].querySelector('#modal-area'));
            modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'home/add-program.modal.html',
                scope: $scope
            });
        };

        /* add the typed in program */
        $scope.addProgram = function(program) {
            console.log("adding Program");
            if(program != "") {
                console.log("In if");
                var postData = {name: program};
                ProgramsSvc.postNewProgram(postData).then(
                    function onSuccess(response) {
                        $scope.addProgramMessage = {success: 'Successfuly added ' + program + '.'};
                        $scope.newProgram = "";
                    }, function onFailure(response) {
                        $scope.addProgramMessage = {error: 'Failed to add ' + program + '.'};
                        $scope.newProgram = "";
                    });
                
            }
        };

    	$scope.openChangeProgram = function() {
			var modalElement = angular.element($document[0].querySelector('#modal-area'));
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

    	$scope.closeModal = function() {
    		modalInstance.dismiss('no');
    	};

    	//initialization
		ProgramsSvc.getActivePrograms().then(function onSuccess(response) {
			$scope.programs = response.data;
		});

    }]);

})();
