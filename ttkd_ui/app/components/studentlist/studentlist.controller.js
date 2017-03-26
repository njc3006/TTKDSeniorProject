(function() {

  angular.module('ttkdApp.studentlistCtrl', ['ttkdApp.constants'])

    .controller('StudentListCtrl', ['$scope', '$rootScope', '$filter', '$stateParams', 'StudentListService', 
        'ProgramsSvc', 'apiHost',
        function($scope, $rootScope, $filter, $stateParams, StudentListService, ProgramsSvc, apiHost) {
        $rootScope.showCurrentProgram = !$stateParams.hideCurrentProgram;

        $scope.apiHost = apiHost;

        $scope.people = [];
        $scope.allPeople = [];
        $scope.classPeople = [];
        $scope.attendanceRecords = [];
        $scope.classAttendance = [];
        $scope.classes = [];
        $scope.belts = [];
        $scope.sortAZ = true;
        $scope.sortDisplayString = 'A-Z';
        $scope.studentsLoaded = false;

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

        //updates the displayed list of students based on the current filters
        $scope.setDisplayedStudents = function(){
            var filteredList = [];
            var displayedPeople = $scope.filters.currentProgramId ? $scope.classPeople : $scope.allPeople;
            var displayedAttendance = $scope.attendanceRecords;

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

            //filter based on specific selected belt (if not null)
            if($scope.filters.currentBelt !== null){
                var filteredByBelt = [];

                angular.forEach(filteredList, function(value){
                    if(value.person.belt.id === $scope.filters.currentBelt.id){
                        filteredByBelt.push(value);
                    }
                });

                filteredList = filteredByBelt;
            } 

            //update the displayed list of people
            $scope.people = filteredList;

            //set the colored belt border for every displayed student
            angular.forEach($scope.people, function(value){
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
        $scope.getAllStudents = function(){
            StudentListService.getAllStudents().then(
                function(response){
                    var tempdata = response.data;
                    var temp2 = [];

                    angular.forEach(tempdata, function(value){
                        var transformed = {
                            id: value.id,
                            person: value,
                            program: null,
                            fullName: value.first_name + ' ' + value.last_name
                        };

                        temp2.push(transformed);
                    });

                    $scope.allPeople = temp2;
                    $scope.setDisplayedStudents();
                    $scope.studentsLoaded = true;
                });
        };

        //retrieves the list of students in a specific class
        $scope.getStudentsFromProgram = function(){
            $scope.studentsLoaded = false;
            var classId = '';

            if($scope.filters.currentProgramId != null){
                classId = $scope.filters.currentProgramId;
            }

            StudentListService.getStudentsFromProgram(classId).then(
                function (response){
                    $scope.classPeople = response.data;

                    // This will updateDisplayedStudents and set studentsLoaded
                    $scope.updateAttendanceRecords();
                });
        };

        //initialization
        $scope.getProgramList();
        $scope.getBeltList();
        $scope.getAllStudents();

        $scope.updateAttendanceRecords = function(){
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
        };

        //date picker watcher
        $scope.$watch('selectedDate.value', function(newValue, oldValue) {
            // This if prevents the method from being run on first load of the page
            // Not quite sure why that is happening, but this fixes it
            if (newValue !== oldValue){
                $scope.updateAttendanceRecords();
            }
        });

        //class dropdown watcher
        $scope.$watch('filters.currentProgramId', function(newValue, oldValue){
            if($scope.filters.currentProgramId != null){
                $scope.getStudentsFromProgram();
            }
        });

        //searchbox watcher
        $scope.$watch('filters.searchQuery', function(newValue, oldValue) {
            $scope.setDisplayedStudents();
        });

    }]);

})();