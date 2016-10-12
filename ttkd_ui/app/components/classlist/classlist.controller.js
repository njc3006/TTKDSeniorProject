(function() {

  angular.module('ttkdApp.classlistCtrl', [])

    .controller('ClassListCtrl', ['$scope', 'ClassListSvc' , function($scope, ClassListService) {
        $scope.sortAZ = true;
        $scope.showActive = true;
        $scope.showInactive = false;

        $scope.sortDisplayString = "A-Z";

        $scope.classes = [
            'class1',
            'class2',
            'class3',
            'class4'
        ];

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

        $scope.currentClass = $scope.classes[1];

        $scope.toggleSortAlpha = function(){
            $scope.sortAZ = !$scope.sortAZ;
            $scope.sortDisplayString = $scope.sortAZ ? "A-Z" : "Z-A";   //toggle the displayed string
        };


        $scope.people = [];
        
        $scope.people = ClassListService.getClassList();
        console.log($scope.people);

        // for (var i = 0; i < 30; i++) {
        //     $scope.people.push(
        //         {
        //             name: 'Person ' + i,
        //             picture: 'http://placehold.it/50x50',
        //             emgContact1: 'Parent ' + i,
        //             emgPhone1: '867-5309',
        //             emgContact2: 'Relative ' + i,
        //             emgPhone2: '444-4444'
        //         }
        //     );
        // }


    }]);

})();
