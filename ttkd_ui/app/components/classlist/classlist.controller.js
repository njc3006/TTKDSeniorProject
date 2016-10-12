(function() {

  angular.module('ttkdApp.classlistCtrl', [])

    .controller('ClassListCtrl', ['$scope', 'ClassListService' , function($scope, ClassListService) {
        $scope.people = [];
        $scope.sortAZ = true;
        $scope.showActive = true;
        $scope.showInactive = false;

        $scope.sortDisplayString = "A-Z";
        $scope.classes = [];

        $scope.belts = [
            'white',
            'orange',
            'yellow',
            'green',
            'purple',
            'blue',
            'brown',
            'red',
            'red/black',
            'black'
        ];


        $scope.toggleSortAlpha = function(){
            $scope.sortAZ = !$scope.sortAZ;
            $scope.sortDisplayString = $scope.sortAZ ? "A-Z" : "Z-A";   //toggle the displayed string
        };

        $scope.getClassList = function(){
            ClassListService.getClassList().then(
                function(response){
                    $scope.classes = response.data;
                    console.log(response.data);
                    $scope.currentClass = $scope.classes[1];

                });        
        };

        $scope.getPeople = function(){
            ClassListService.getAllPersons().then(
                function(response){
                    $scope.people = response.data;
                });
        };

        $scope.getClassList();

    }]);

})();
