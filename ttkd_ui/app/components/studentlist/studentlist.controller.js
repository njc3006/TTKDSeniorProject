(function() {

  angular.module('ttkdApp.studentlistCtrl', [])

    .controller('StudentListCtrl', ['$scope', '$rootScope', '$filter', '$stateParams', 'StudentListService', 'ProgramsSvc',
        function($scope, $rootScope, $filter, $stateParams, StudentListService, ProgramsSvc) {
        $rootScope.showCurrentProgram = !$stateParams.hideCurrentProgram;

        $scope.people = [];
        $scope.allPeople = [];
        $scope.classPeople = [];
        $scope.allAttendance = [];
        $scope.classAttendance = [];
        $scope.classes = [];
        $scope.belts = [];
        $scope.sortAZ = true;
        $scope.sortDisplayString = 'A-Z';

        $scope.filters = {
            showActive: true,
            showInactive: false,
            searchQuery: '',
            currentBelt: null,
            currentClass: null,
        };

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
                value.person.picturePath = 'http://placehold.it/110x110';
            });

            return tempdata;
        };

        //updates the displayed list of students based on the current filters
        $scope.setDisplayedStudents = function(){
            var filteredList = [];
            var displayedPeople = $scope.filters.currentClass ? $scope.classPeople : $scope.allPeople;
            var displayedAttendance = $scope.filters.currentClass ? $scope.classAttendance : $scope.allAttendance;

            //filter based on active/inactive checkboxes
            for(var i = 0; i < displayedPeople.length; i++){
                var person = displayedPeople[i].person;
                if(($scope.filters.showActive && (person.active === $scope.filters.showActive)) || 
                    ($scope.filters.showInactive && (person.active !== $scope.filters.showInactive))){
                        filteredList.push(displayedPeople[i]);
                }
            }

            //filter based on specific selected date
            if($scope.selectedDate.value != null){

                //matches the format returned from the backend, used to find attendance records of the correct day
                var formattedDate = $scope.getCurrentFormattedDate($scope.selectedDate.value);
                var filteredByDate = [];

                //loop through and find all students who have attendance records of the specified date
                for(var k = 0; k < filteredList.length; k++){
                    for(var j = 0; j < displayedAttendance.length; j++){
                        if(filteredList[k].person.id === displayedAttendance[j].person &&
                            displayedAttendance[j].date === formattedDate){
                                filteredByDate.push(filteredList[k]);
                                break;
                        }
                    }
                }

                //update the filtered list
                filteredList = filteredByDate;
            }

            //filter based on search criteria
            if($scope.filters.searchQuery !== ''){
                filteredList = $filter('filter')(filteredList, $scope.filters.searchQuery);
            }

            //filter based on specific selected belt
            // if($scope.filters.currentBelt !== ''){
            //     var filteredByBelt = [];

            //     for(var i = 0; i < filteredList.length; i++){
            //         if(filteredList[i].person.belt && filteredList[i].person.belt === $scope.filters.currentBelt.id){
            //             filteredByBelt.push(filteredList[i]);
            //         }
            //      }

            //     filteredList = filteredByBelt;
            // }

            $scope.people = filteredList;
        };
      
        //retrieves the master list of belts
        $scope.getBeltList = function(){
            StudentListService.getBeltList().then(
                function(response){
                    $scope.belts = response.data;
                });
        };

        //retrieves the total list of classes
        $scope.getClassList = function(){
            ProgramsSvc.getPrograms().then(
                function(response){
                    $scope.classes = response.data;
                });        
        };

        //retrieves the list of all students in the system
        $scope.getAllStudents = function(){
            StudentListService.getAllStudents().then(
                function(response){
                    var tempdata = response.data;
                    var temp2 = [];

                    angular.forEach(tempdata, function(value){
                        var transformed = {
                            id: value.id,
                            person: value,
                            program: null
                        };

                        temp2.push(transformed);
                    });

                    StudentListService.getAllCheckedIn().then(
                        function(response){
                            $scope.allAttendance = response.data;
                
                            $scope.allPeople = $scope.transformData(temp2);
                            $scope.setDisplayedStudents();
                        });
                });        
        };

        //retrieves the list of students in a specific class
        $scope.getStudentsFromClass = function(){
            var classId = '';

            if($scope.filters.currentClass != null){
                classId = $scope.filters.currentClass.id;
            }

            StudentListService.getStudentsFromClass(classId).then(
                function (response){
                    $scope.classPeople = $scope.transformData(response.data);

                    var formattedDate = $scope.getCurrentFormattedDate(new Date());
                    StudentListService.getClassAttendanceRecords(classId, formattedDate).then(
                        function(response){
                            $scope.classAttendance = response.data;

                            // StudentListService.getStudentListWithBelts($scope.classPeople).then(
                            //     function(response){
                            //         console.log(reponse.data);
                            //     });

                            var returned = 0;

                            angular.forEach($scope.classPeople, function(value){
                                StudentListService.getStudentBelt(value.person.id).then(
                                    function(response){
                                        returned += 1;
                                        value.person.belt = response.data[0];

                                        if(returned === $scope.classPeople.length){
                                            console.log("DONE");
                                            console.log($scope.classPeople);
                                            $scope.setDisplayedStudents();
                                        }
                                    });
                            });

                            // //this might not work because the above async calls might not
                            // //be done by the time setDisplayedStudents() is called;
                            // $scope.setDisplayedStudents();
                        });
                });
        };

        //initialization
        $scope.getClassList();
        $scope.getBeltList();
        $scope.getAllStudents();

        //date picker watcher
        $scope.$watch('selectedDate.value', function(newValue, oldValue) {
            $scope.setDisplayedStudents();
        });

        //class dropdown watcher
        $scope.$watch('filters.currentClass', function(newValue, oldValue){
            if($scope.filters.currentClass != null){
                $scope.getStudentsFromClass();
            }
        });

        //searchbox watcher
        $scope.$watch('filters.searchQuery', function(newValue, oldValue) {
            $scope.setDisplayedStudents();
        });

    }]);

})();