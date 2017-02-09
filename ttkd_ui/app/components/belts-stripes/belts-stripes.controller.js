(function() {

  angular.module('ttkdApp.beltsStripesCtrl', ['ttkdApp.constants'])

    .controller('BeltsStripesCtrl', ['$scope', '$rootScope', '$stateParams', 'BeltsStripesService', 
        function($scope, $rootScope, $filter, $stateParams, StudentListService, ProgramsSvc) {
        $rootScope.showCurrentProgram = !$stateParams.hideCurrentProgram;

        $scope.status = 'new';
        $scope.type = 'belt';
        $scope.active = false;
        $scope.pageTitle = '';

        $scope.initPageTitle = function(){
        	$scope.pageTitle = $scope.status + ' ' + $scope.type;
        };

        $scope.save = function(){
        	if($scope.status === 'new'){
        		if($scope.type === 'belt'){
        			//post belt
        		} else {
        			//post stripe
        		}
        	} else {
        		if($scope.type === 'belt'){
        			//put belt
        		} else {
        			//put stripe
        		}
        	}

        	console.log("saved");
        };

       	$scope.initPageTitle();

    }]);

})();