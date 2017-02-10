(function() {

  angular.module('ttkdApp.beltsStripesCtrl', ['ttkdApp.constants'])

    .controller('BeltsStripesCtrl', ['$scope', '$rootScope', '$stateParams', 'BeltsStripesService', 
        function($scope, $rootScope, $stateParams, StudentListService, ProgramsSvc) {
        $rootScope.showCurrentProgram = !$stateParams.hideCurrentProgram;

        $scope.belts = [
            {
                name: 'red'
            },
            {
                name: 'blue'
            },
            {
                name: 'green'
            }
        ];

         $scope.stripes = [
            {
                name: 'yellow'
            },
            {
                name: 'black'
            },
            {
                name: 'purple'
            }
        ];

        $scope.showEdit = false;
        $scope.active = false;
        $scope.status = '';
        $scope.type = '';
        $scope.pageTitle = '';
        $scope.currentObj = {};

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
        };

        $scope.addNew = function(type){
            $scope.type = type;
            $scope.status = 'new';
            $scope.currentObj = {};

            $scope.showEdit = true;

        }

        $scope.edit = function(type, obj){
            $scope.type = type;
            $scope.status = 'edit';

            $scope.showEdit = true;
            $scope.currentObj = obj;

            $scope.name = $scope.currentObj.name;
        }

        $scope.backNavigate = function() {
            $scope.showEdit = false;
            $scope.active = false;
            $scope.status = '';
            $scope.type = '';
            $scope.pageTitle = '';
            $scope.currentObj = {};
        };

    }]);

})();