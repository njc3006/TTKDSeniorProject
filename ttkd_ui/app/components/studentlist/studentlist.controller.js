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
        $scope.allAttendance = [];
        $scope.classAttendance = [];
        $scope.classes = [];
        $scope.belts = [];
        $scope.sortAZ = true;
        $scope.sortDisplayString = 'A-Z';
        $scope.currentPage = 1;
        $scope.itemsPerPage = 5;

        $scope.filters = {
            showActive: true,
            showInactive: false,
            searchQuery: '',
            currentBelt: null,
            currentClassId: null,
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

        //updates the displayed list of students based on the current filters
        $scope.setDisplayedStudents = function(){
            var filteredList = [];
            var displayedPeople = $scope.filters.currentClassId ? $scope.classPeople : $scope.allPeople;
            var displayedAttendance = $scope.filters.currentClassId ? $scope.classAttendance : $scope.allAttendance;

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
            if($scope.filters.currentBelt){
                var filteredByBelt = [];
                var filteredPersonIds = [];

                StudentListService.getStudentsWithBelt($scope.filters.currentBelt.id).then(
                        function(response){
                            // Strip the response down to a list of person ids
                            angular.forEach(response.data, function(value){
                                filteredPersonIds.push(value.person);
                            });

                            // For the current filtered list, if the person has the selected belt
                            // (indicated by being in the list of person ids)
                            // add them to the filteredByBelt list
                            for(var i = 0; i < filteredList.length; i++){
                                var index = filteredPersonIds.indexOf(filteredList[i].person.id);
                                if (index !== -1){
                                    filteredByBelt.push(filteredList[i]);
                                }
                            }

                            filteredList = filteredByBelt;
                            $scope.people = filteredList;
                        });

            // This else is needed because of the async response from getStudentsWithBelt above.
            // Future modification of $scope.people below this else will be overridden after the
            // response, so if you need to modify $scope.people do it before the belt filtering
            } else {
                $scope.people = filteredList;
               /* $scope.people = filteredList.slice((($scope.currentPage - 1) * $scope.itemsPerPage), 
                    (($scope.currentPage) * $scope.itemsPerPage));*/
            }
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
                
                            $scope.allPeople = temp2;
                            $scope.setDisplayedStudents();
                        });
                });        
        };

        //retrieves the list of students in a specific class
        $scope.getStudentsFromClass = function(){
            var classId = '';

            if($scope.filters.currentClassId != null){
                classId = $scope.filters.currentClassId;
            }

            StudentListService.getStudentsFromClass(classId).then(
                function (response){
                    $scope.classPeople = response.data;

                    var formattedDate = $scope.getCurrentFormattedDate(new Date());
                    StudentListService.getClassAttendanceRecords(classId, formattedDate).then(
                        function(response){
                            $scope.classAttendance = response.data;

                            $scope.setDisplayedStudents();
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
        $scope.$watch('filters.currentClassId', function(newValue, oldValue){
            if($scope.filters.currentClassId != null){
                $scope.getStudentsFromClass();
            }
        });

        //searchbox watcher
        $scope.$watch('filters.searchQuery', function(newValue, oldValue) {
            $scope.setDisplayedStudents();
        });

    }]);

})();