(function() {

  angular.module('ttkdApp.classlistCtrl', [])

    .controller('ClassListCtrl', ['$scope', '$stateParams', 'ClassListService',
        function($scope, $stateParams, ClassListService) {
        $scope.people = [];
        $scope.allStudents = [];
        $scope.classes = [];
        $scope.sortAZ = true;
        $scope.sortDisplayString = 'A-Z';

        $scope.filters = {
            showActive: true,
            showInactive: false,
            showPresent: ($stateParams.classId === null ? true : false),
            searchQuery: null,
            currentBelt: null,
            currentClass: null,
            selectedDate: null
        };

        $scope.belts = [
            'White',
            'Yellow',
            'Orange',
            'Green',
            'Blue',
            'Purple',
            'Red',
            'Brown',
            'Hi-Brown',
            'Provisional'
        ];

        //switches the displayed sort order
        $scope.toggleSortAlpha = function(){
            $scope.sortAZ = !$scope.sortAZ;
            $scope.sortDisplayString = $scope.sortAZ ? 'A-Z' : 'Z-A';   //toggle the displayed string
        };

        //transforms the data to include a temp picture property
        $scope.transformData = function(data){
            var tempdata = data;
            //Until we have picture working this is the default picture for testing/layout
            angular.forEach(tempdata, function(value){
                value.picture = 'http://placehold.it/110x110';
            });

            return tempdata;
        };

        //filters out and displays specific students based on the current $scope.filters criteria
        $scope.updateDisplayed = function(students){
            var filteredStudents = [];

            angular.forEach(students, function(value, key){
                if($scope.filters.showActive && value.active === $scope.filters.showActive){
                    filteredStudents.push(value);
                }
                else if($scope.filters.showInactive && value.active !== $scope.filters.showInactive){
                    filteredStudents.push(value);
                }

                //needs to include 'present' TODO
            });

            $scope.people = filteredStudents;
        };

        //updates the currently displayed list of students based on 
        $scope.setDisplayedStudents = function(){
            if($scope.filters.currentClass === null && $stateParams.classId !== null){
                $scope.filters.currentClass = $scope.classes[$stateParams.classId];
                
                //this is only used for initialization, remove it once we have set $scope.filters.currentClass
                $stateParams.classId = null;  
            }

            //'(x == null)' is the same as 'typeof(x) === "undefined" && x === null'
            //the '==' instead of '===' is intentional, don't change it! 
            if($scope.filters.currentClass != null && $scope.filters.currentClass.id !== null){
                var tempdata = [];
                angular.forEach($scope.allStudents, function(value, key){

                    //temp until backend update TODO: remove
                    if(key % 2 === 0){ value.belt = 'green'; }
                    else { value.belt = 'yellow'; }

                    if(value.program === $scope.filters.currentClass.id){
                        tempdata.push(value);
                    }
                });
                
                $scope.updateDisplayed(tempdata);
            }
            else{
                
                //temp until backend update TODO: remove
                angular.forEach($scope.allStudents, function(value, key){
                    if(key % 2 === 0){ value.belt = 'green'; }
                    else { value.belt = 'yellow'; }
                });

                $scope.updateDisplayed($scope.allStudents);
            }
        };

        //retrieves the total list of classes
        $scope.getClassList = function(){
            ClassListService.getClassList().then(
                function(response){
                    $scope.classes = response.data;

                    $scope.getAllStudents();
                });        
        };

        //retrieves the list of all students in the system
        $scope.getAllStudents = function(){
            ClassListService.getAllStudents().then(
                function(response){
                     var tempdata = response.data;
                    
                    //we need a uniform structure for both the students and persons
                    //to do so we take the information in the "person" property of the student object and put it
                    //directly into the student object to match the structure of the person object
                    angular.forEach(tempdata, function(value, key){
                        angular.forEach(value['person'], function(v2, k2){
                            value[k2] = v2;
                            delete value['person'];
                        });
                    });

                    $scope.allStudents = $scope.transformData(tempdata);
                    $scope.setDisplayedStudents();
                });        
        };

        //initialization call
        $scope.getClassList();

    }]);

})();