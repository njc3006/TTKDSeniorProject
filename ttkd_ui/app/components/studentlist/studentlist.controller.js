(function() {

  angular.module('ttkdApp.studentlistCtrl', ['ttkdApp.constants'])

    .controller('StudentListCtrl', ['$scope', '$rootScope', '$filter', '$stateParams', 'StudentListService', 
        'ProgramsSvc', 'apiHost', '$q',
        function($scope, $rootScope, $filter, $stateParams, StudentListService, ProgramsSvc, apiHost, $q) {
        $rootScope.showCurrentProgram = $stateParams.showCurrentProgram;

        $scope.apiHost = apiHost;

        $scope.people = [];
        $scope.allPeople = [];
        $scope.activePeople = [];
        $scope.inactivePeople = [];
        $scope.attendanceRecords = [];
        $scope.classAttendance = [];
        $scope.classes = [];
        $scope.belts = [];
        $scope.sortAZ = true;
        $scope.sortDisplayString = 'A-Z';
        $scope.studentsLoaded = false;
        $scope.promises = [];

        $scope.filters = {
            showActive: true,
            showInactive: false,
            searchQuery: '',
            currentBelt: null,
            currentProgramId: null,
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

        $scope.getCurrentFormattedDate = function(date){
            return $filter('date')(date, 'yyyy-MM-dd');
        };

        $scope.getBeltStyle = function(belt) {
            var primaryStyle = belt['primary_color'].toLowerCase() === 'ffffff' ?
                'black 8px double' :
                '#' + belt['primary_color'] + ' 8px solid';

                var secondaryStyle = belt['secondary_color'].toLowerCase() === 'ffffff' ?
                    'black 8px double' :
                    '#' + belt['secondary_color'] + ' 8px solid';

            return {
                'border-right': secondaryStyle,
                'border-left': primaryStyle,
                'border-top': primaryStyle,
                'border-bottom': secondaryStyle
            };
        };

        $scope.updateActiveDisplay = function () {
            $scope.studentsLoaded = false;
            $scope.promises = [];

            // If the list already has something in it, then nothing has changed so no need to get
            // it again so fall onto else
            if ($scope.activePeople.length ===0){

                // If the currentProgramId is "" that means the first option is selected ie. no program
                if($scope.filters.currentProgramId !== null && $scope.filters.currentProgramId !== "") {
                    getActiveStudentsFromProgram();
                } else {
                    getAllActiveStudents();
                }

                $q.all($scope.promises).then(function(){
                    $scope.setDisplayedStudents();
                    $scope.studentsLoaded = true;
                });
            } else {
                $scope.setDisplayedStudents();
                $scope.studentsLoaded = true;
            }
        };

        $scope.updateInactiveDisplay = function () {
            $scope.studentsLoaded = false;
            $scope.promises = [];

            // If the list already has something in it, then nothing has changed so no need to get
            // it again so fall onto else
            if ($scope.inactivePeople.length ===0){

                // If the currentProgramId is "" that means the first option is selected ie. no program
                if($scope.filters.currentProgramId !== null && $scope.filters.currentProgramId !== "") {
                    getInactiveStudentsFromProgram();
                } else {
                   getAllInactiveStudents()
                }
                $q.all($scope.promises).then(function(){
                    $scope.setDisplayedStudents();
                    $scope.studentsLoaded = true;
                });
            } else {
                $scope.setDisplayedStudents();
                $scope.studentsLoaded = true;
            }
        };

        //updates the displayed list of students based on the current filters
        $scope.setDisplayedStudents = function(){

            var displayedPeople = [];

             if ($scope.filters.showActive){
                 // This is the correct way to push on array into another
                 displayedPeople.push.apply(displayedPeople, $scope.activePeople);
             }

             if ($scope.filters.showInactive){

                 // This is the correct way to push on array into another
                 displayedPeople.push.apply(displayedPeople, $scope.inactivePeople);
             }

             var filteredList = displayedPeople;

            //filter based on specific selected date
            if($scope.selectedDate.value != null){

                //matches the format returned from the backend, used to find attendance records of the correct day
                var formattedDate = $scope.getCurrentFormattedDate($scope.selectedDate.value);
                var filteredByDate = [];
                var displayedAttendance = $scope.attendanceRecords;

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

            //filter based on specific selected belt (if not null)
            if($scope.filters.currentBelt !== null){
                var filteredByBelt = [];

                angular.forEach(filteredList, function(value){
                    if(value.person.belt && (value.person.belt.id === $scope.filters.currentBelt.id)){
                        filteredByBelt.push(value);
                    }
                });

                filteredList = filteredByBelt;
            } 

            //update the displayed list of people
            $scope.people = filteredList;

            //set the colored belt border for every displayed student
            //and create a full name for everyone so searching by first and last name works correctly
            angular.forEach($scope.people, function(value){
                value.person.full_name = value.person.first_name + ' ' + value.person.last_name;

                if(value.person.belt){
                    value.beltStyle = $scope.getBeltStyle(value.person.belt);
                }
            });
        };
      
        //retrieves the master list of belts
        $scope.getBeltList = function(){
            StudentListService.getBeltList().then(
                function(response){
                    $scope.belts = response.data;
                });
        };

        //retrieves the total list of classes
        $scope.getProgramList = function(){
            ProgramsSvc.getPrograms().then(
                function(response){
                    $scope.classes = response.data;
                });        
        };

        //retrieves the list of all students in the system
        function getAllActiveStudents(){
            $scope.promises.push(StudentListService.getAllActiveStudents().then(
                function(response){
                    var tempdata = response.data;

                    // We need to nest the people object inside person to match the format of
                    // class-people
                    $scope.activePeople = tempdata.map(function (value) {
                            return {
                                id: value.id,
                                person: value
                            };
                        }
                    );
                }));
        }

        function getAllInactiveStudents() {
            $scope.promises.push(StudentListService.getAllInactiveStudents().then(
                function(response){
                    var tempdata = response.data;

                    // We need to nest the people object inside person to match the format of
                    // class-people
                    $scope.inactivePeople = tempdata.map(function (value) {
                            return {
                                id: value.id,
                                person: value
                            };
                        }
                    );
                }));
        }

        //retrieves the list of active students in a specific class
        function getActiveStudentsFromProgram(){
            var classId = $scope.filters.currentProgramId;
            $scope.promises.push(StudentListService.getActiveStudentsFromProgram(classId).then(
                function (response){
                    $scope.activePeople = response.data;
                }));
        }

        //retrieves the list of inactive students in a specific class
        function getInactiveStudentsFromProgram(){
            var classId = $scope.filters.currentProgramId;
            $scope.promises.push(StudentListService.getInactiveStudentsFromProgram(classId).then(
                function (response) {
                    $scope.inactivePeople = response.data;
                    $scope.setDisplayedStudents();
                    $scope.studentsLoaded = true;
                }));
        }


        $scope.changeProgram = function () {

            $scope.studentsLoaded = false;
            $scope.activePeople = [];
            $scope.inactivePeople = [];
            $scope.promises = [];

            // If the currentProgramId is "" that means the first option is selected ie. no program
            if($scope.filters.currentProgramId !== null && $scope.filters.currentProgramId !== "") {
                if ($scope.filters.showActive){
                    getActiveStudentsFromProgram();
                }

                if ($scope.filters.showInactive){
                    getInactiveStudentsFromProgram();
                }

            // Switching back to no program filter
            } else {
                if ($scope.filters.showActive){
                    getAllActiveStudents();
                }

                if ($scope.filters.showInactive){
                    getAllInactiveStudents();
                }
            }

            $q.all($scope.promises).then(function(){
                // This will updateDisplayedStudents and set studentsLoaded
                updateAttendanceRecords();
            });
        };


        //initialization
        $scope.getProgramList();
        $scope.getBeltList();
        // Calling change program for the first time will just load all active students
        $scope.changeProgram();

        function updateAttendanceRecords(){
            $scope.studentsLoaded = false;
            if ($scope.selectedDate.value !== null && $scope.selectedDate.value !== undefined) {

                var selectedDate = $scope.getCurrentFormattedDate($scope.selectedDate.value);

                // If we have a current program, we can make the checkin request more specific
                if($scope.filters.currentProgramId != null) {
                    StudentListService.getProgramAttendanceRecords(
                        $scope.filters.currentProgramId,
                        selectedDate).then(
                            function (response) {
                                $scope.attendanceRecords = response.data;
                                $scope.setDisplayedStudents();
                                $scope.studentsLoaded = true;
                            });
                } else {
                    // No current program, so get all attendance records for the date
                    StudentListService.getCheckinsForDate(selectedDate).then(
                        function (response) {
                            $scope.attendanceRecords = response.data;
                            $scope.setDisplayedStudents();
                            $scope.studentsLoaded = true;
                        });
                }
            } else {
                // The date is either null or undefined, no need to send that to the api,
                // just clear the records
                $scope.attendanceRecords = [];
                $scope.setDisplayedStudents();
                $scope.studentsLoaded = true;
            }
        }

        //date picker watcher
        $scope.$watch('selectedDate.value', function(newValue, oldValue) {
            // This if prevents the method from being run on first load of the page
            // Not quite sure why that is happening, but this fixes it
            if (newValue !== oldValue){
                updateAttendanceRecords();
            }
        });

        //searchbox watcher
        $scope.$watch('filters.searchQuery', function(newValue, oldValue) {
            $scope.setDisplayedStudents();
        });

    }]);

})();