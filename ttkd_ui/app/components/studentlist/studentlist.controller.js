(function() {

  angular.module('ttkdApp.studentlistCtrl', [])

    .controller('StudentListCtrl', ['$scope', '$stateParams', 'StudentListService',
        function($scope, $stateParams, StudentListService) {
        $scope.people = [];                 //currently displayed list of students
        $scope.allStudents = [];            //every student in the system
        $scope.classes = [];                //every class in the system
        $scope.attendanceRecords = [];      //all attendance records in the system
        $scope.sortAZ = true;
        $scope.sortDisplayString = 'A-Z';

        $scope.filters = {
            showActive: true,
            showInactive: false,
            searchQuery: null,
            currentBelt: null,
            currentClass: null,
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

        $scope.selectedDate = {
            open: false,
            value: null
        };

        //opens the popup date picker window
        $scope.open = function(){
            $scope.selectedDate.open = true;
        };

        //sets the date picker date to today
        $scope.today = function(){
            $scope.selectedDate.value = new Date();
        };

        //switches the displayed sort order
        $scope.toggleSortAlpha = function(){
            $scope.sortAZ = !$scope.sortAZ;
            $scope.sortDisplayString = $scope.sortAZ ? 'A-Z' : 'Z-A';   //toggle the displayed string
        };

        //I realize the date formatting is hacky and would like a cleaner solution. Feel free to suggest one.
        $scope.getCurrentFormattedDate = function(date){
            var formatDay = date.getDate();
            var formatMonth = date.getMonth() + 1;
            if(formatDay < 10) { formatDay = '0' + formatDay; }
            if(formatMonth < 10) { formatMonth = '0 ' + formatMonth; }

            //matches the format returned from the backend, used to find attendance records of the correct day
            var formattedDate = date.getFullYear() + '-' + formatMonth + '-' + formatDay;

            return formattedDate;
        };

        //transforms the data to include a temp picture property
        $scope.transformData = function(data){
            var tempdata = data;
            //Until we have picture working this is the default picture for testing/layout
            angular.forEach(tempdata, function(value){
                value.person.picture = 'http://placehold.it/110x110';
            });

            return tempdata;
        };

        //filters out and displays specific students based on the current $scope.filters criteria
        $scope.updateDisplayed = function(students){
            var filteredStudents = [];

            //filter out students based on the active/inactive options
            angular.forEach(students, function(value, key){
                if($scope.filters.showActive && value.person.active === $scope.filters.showActive){
                    filteredStudents.push(value);
                }
                else if($scope.filters.showInactive && value.person.active !== $scope.filters.showInactive){
                    filteredStudents.push(value);
                }
            });

            //if a specific date is selected
            if($scope.selectedDate.value != null){

               //matches the format returned from the backend, used to find attendance records of the correct day
                var formattedDate = $scope.getCurrentFormattedDate($scope.selectedDate.value);
                var filteredByDate = [];

                //loop through and find all students who have attendance records of the specified date
                for(var i = 0; i < filteredStudents.length; i++){
                    for(var j = 0; j < $scope.attendanceRecords.length; j++){
                        if(filteredStudents[i].person.id === $scope.attendanceRecords[j].person.id &&
                            $scope.attendanceRecords[j].date === formattedDate){
                                filteredByDate.push(filteredStudents[i]);
                                break;
                        }
                    }
                }

                //update the filtered list
                filteredStudents = filteredByDate;
            }

            //and update the bound variable to reflect the filtered changes
            $scope.people = filteredStudents;
        };

        //updates the currently displayed list of students based on 
        $scope.setDisplayedStudents = function(){

            //only runs the first time, used to make sure the current class and classId are synched
            if($scope.filters.currentClass === null && $stateParams.classId !== null){
                $scope.filters.currentClass = $scope.classes[$stateParams.classId];
                
                //this is only used for initialization, remove it once we have set $scope.filters.currentClass
                $stateParams.classId = null;  
            }

            //only display a specific class' students
            //
            //'(x == null)' is the same as 'typeof(x) === "undefined" && x === null'
            //the '==' instead of '===' is intentional, don't change it! 
            if($scope.filters.currentClass != null && $scope.filters.currentClass.id !== null){
                var tempdata = [];
                angular.forEach($scope.allStudents, function(value, key){

                    //temp until backend update TODO: remove
                    if(key % 2 === 0){ value.person.belt = 'green'; }
                    else { value.person.belt = 'yellow'; }

                    if(value.program === $scope.filters.currentClass.id){
                        tempdata.push(value);
                    }
                });
                
                $scope.updateDisplayed(tempdata);
            }
            //otherwise display data for all students
            else{
                
                //temp until backend update TODO: remove
                angular.forEach($scope.allStudents, function(value, key){
                    if(key % 2 === 0){ value.person.belt = 'green'; }
                    else { value.person.belt = 'yellow'; }
                });

                $scope.updateDisplayed($scope.allStudents);
            }
        };

        //retrieves the total list of classes
        $scope.getClassList = function(){
            StudentListService.getClassList().then(
                function(response){
                    $scope.classes = response.data;

                    $scope.getAllStudents();
                });        
        };

        //retrieves the list of all students in the system
        $scope.getAllStudents = function(){
            StudentListService.getAllStudents().then(
                function(response){
                    var tempdata = response.data;
                    
                    $scope.allStudents = $scope.transformData(tempdata);
                    $scope.setDisplayedStudents();
                });        
        };

        //retrieves all attendance records
        $scope.getAllCheckedIn = function(){
            StudentListService.getAllCheckedIn().then(
                function(response){
                    $scope.attendanceRecords = response.data;
                });
        };

        $scope.getClassAttendanceRecords = function(){
            var classId = '';
            var formattedDate = $scope.getCurrentFormattedDate(new Date());
       
            if($scope.filters.currentClass != null){
                classId = $scope.filters.currentClass.id;
            }

            StudentListService.getClassAttendanceRecords(classId, formattedDate).then(
                function(response){
                    $scope.inAttendance = response.data;
                });
        };

        //initialization call
        $scope.getClassList();
        $scope.getAllCheckedIn();

        //date picker watcher
        $scope.$watch('selectedDate.value', function(newValue, oldValue) {
            $scope.setDisplayedStudents();
        });

        $scope.$watch('filters.currentClass', function(newValue, oldValue){
            $scope.getClassAttendanceRecords();
        });
    }]);

})();