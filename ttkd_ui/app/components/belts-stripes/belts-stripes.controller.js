(function() {

  angular.module('ttkdApp.beltsStripesCtrl', ['ttkdApp.constants'])

    .controller('BeltsStripesCtrl', ['$scope', '$rootScope', '$stateParams', 'BeltsStripesService', 
        function($scope, $rootScope, $filter, $stateParams, StudentListService, ProgramsSvc) {
        $rootScope.showCurrentProgram = !$stateParams.hideCurrentProgram;

        //opens the popup date picker window
        $scope.open = function(){
            $scope.selectedDate.open = true;
        };

    }]);

})();