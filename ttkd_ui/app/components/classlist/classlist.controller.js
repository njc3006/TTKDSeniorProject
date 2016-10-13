(function() {

  angular.module('ttkdApp.classlistCtrl', [])

    .controller('ClassListCtrl', ['$scope', 'ClassListService' , function($scope, ClassListService) {
        $scope.people = [];
        $scope.allPeople = [];
        $scope.sortAZ = true;
        $scope.sortDisplayString = "A-Z";
        $scope.classes = [];
        $scope.currentBelt = null;

        $scope.filters = {
            showActive: true,
            showInactive: true,
            showPresent: false
        };

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

        $scope.updateDisplayed = function(){
            filteredStudents = [];
            angular.forEach($scope.people, function(value, key){
                if($scope.filters.showActive && value.person.active === $scope.filters.showActive){
                    filteredStudents.push(value);
                }
                else if($scope.filters.showInactive && !value.person.active === $scope.filters.showInactive){
                    filteredStudents.push(value);
                }

                //needs to include 'present' 
            });

            $scope.people = filteredStudents;
        }

        $scope.updateCurrentClass = function(curClass){
            $scope.getStudents(curClass.id);
        };

        $scope.getClassList = function(){
            ClassListService.getClassList().then(
                function(response){
                    $scope.classes = response.data;
                    $scope.currentClass = $scope.classes[1];
                    $scope.getStudents($scope.currentClass.id);
            });        
        };

        $scope.getPeople = function(){
            ClassListService.getAllPeople().then(
                function(response){
                    $scope.allPeople = response.data;
            });
        };

        $scope.getStudents = function(classId){
            ClassListService.getAllStudents(classId).then(
                function(response){
                    $scope.people = response.data;

                    //Until we have picture working this is the default picture for testing/layout
                    angular.forEach($scope.people, function(value){
                        value.picture = 'http://placehold.it/110x110';
                    });

                    $scope.people[0].person.belt = 'green';
                    $scope.people[2].person.belt = 'green';
                    $scope.people[1].person.belt = 'yellow';

                    $scope.updateDisplayed();
            });
        }

        $scope.getClassList();

    }]);

})();
