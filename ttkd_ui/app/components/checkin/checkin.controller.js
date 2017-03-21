(function() {

    angular.module('ttkdApp.checkinCtrl', ['ttkdApp.constants'])

    .controller('CheckinCtrl', ['$scope', '$rootScope', '$stateParams', '$document',
        '$filter', '$uibModal', 'CheckinService', 'apiHost', '$state',
        function($scope, $rootScope, $stateParams, $document, $filter, $uibModal, CheckinService, apiHost, $state) {
            var modalInstance;
            $rootScope.showCurrentProgram = !$stateParams.hideCurrentProgram;

            $scope.apiHost = apiHost;
            $scope.programID = $stateParams.programID;
            $scope.isInstructor = $rootScope.userlevel >= 0;
            $scope.date = new Date();

            $scope.people = [];
            $scope.checkedInPeopleIds = [];
            $scope.checkedInPeopleCheckinIds = [];

            $scope.instructors = [];
            $scope.checkedInInstructorsIds = [];
            $scope.checkedInInstructorsCheckinIds = [];

            $scope.selectedDate = {
                open: false,
                value: $scope.date
            };

            $scope.mode = {
                value: CheckinService.getCheckinMode()
            };

            $scope.headerStr = 'Click A Student Picture to Check Them In';

            $scope.updateHeader = function () {
                if ($scope.mode.value === 'Checkin'){
                    $scope.headerStr = 'Click A Student Picture to Check Them In';
                    CheckinService.setCheckinMode('Checkin')
                } else if ($scope.mode.value === 'View'){
                    $scope.headerStr = 'Click A Student Picture to View Their Information';
                    CheckinService.setCheckinMode('View')
                } else if ($scope.mode.value === 'Edit'){
                    $scope.headerStr = 'Click A Student Picture to Edit Their Information';
                    CheckinService.setCheckinMode('Edit')
                }
            };

            $scope.clickStudentBasedOnMode = function (person) {
                if ($scope.mode.value === 'Checkin'){
                    if (person.checkedIn){
                        $scope.instructClickDeleteCheckin(person);
                    } else{
                        $scope.instructClickCheckin(person);
                    }
                } else if ($scope.mode.value === 'View'){
                    $state.go('studentDetails', ({studentId: person.id}));
                } else if ($scope.mode.value === 'Edit') {
                    $state.go('editStudentDetails' , ({studentId: person.id, backToCheckinID: $scope.programID}));
                }

            };

            $scope.clickInstructorBasedOnMode = function (instructor) {
                if ($scope.mode.value === 'Checkin'){
                    if (instructor.checkedIn){
                        $scope.clickDeleteInstructorCheckin(instructor);
                    } else{
                        $scope.clickCheckinInstructor(instructor);
                    }
                } else if ($scope.mode.value === 'View'){
                    $state.go('studentDetails', ({studentId: instructor.id}));
                } else if ($scope.mode.value === 'Edit') {
                     $state.go('editStudentDetails' , ({studentId: instructor.id,  backToCheckinID: $scope.programID}));
                }

            };

            //opens the popup date picker window
            $scope.open = function() {
                $scope.selectedDate.open = true;
            };

            //sets the date picker date to today
            $scope.today = function() {
                $scope.selectedDate.value = new Date();
            };

            $scope.updateCheckins = function() {
                $scope.date = $scope.selectedDate.value;
                $scope.people = [];
                $scope.checkedInPeopleIds = [];
                $scope.checkedInPeopleCheckinIds = [];
                $scope.instructors = [];
                $scope.checkedInInstructorsIds = [];
                $scope.checkedInInstructorsCheckinIds = [];
                $scope.getCheckinsForProgram();

                if ($scope.isInstructor) {
                    $scope.getInstructorCheckinsForProgram();
                }
            };

            $scope.formatDate = function(date) {
                return $filter('date')(date, 'yyyy-MM-dd');
            };

            $scope.getBeltStyle = function(belt) {
                if (belt) {
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
                }
            };

            //transforms the data to include a temp picture property
            $scope.transformData = function(data) {
                var tempdata = data;
                //Until we have picture working this is the default picture for testing/layout
                angular.forEach(tempdata, function(value) {
                    value.picture = 'http://placehold.it/350x350';
                    value.checkedIn = false;
                });

                return tempdata;
            };

            // Get who is currently checked into the class
            $scope.getCheckinsForProgram = function() {
                CheckinService.getCheckinsForProgram($scope.programID, $scope.formatDate($scope.date)).then(
                    function(response) {
                        var tempdata = response.data;

                        angular.forEach(tempdata, function(value, key) {
                            $scope.checkedInPeopleIds.push(value['person']);
                            $scope.checkedInPeopleCheckinIds.push(value['id']);
                        });

                        $scope.getStudents();
                    });
            };

            // Get all of the students from the class and determine ones already checked in
            $scope.getStudents = function() {
                CheckinService.getStudentsFromProgram($stateParams.programID).then(
                    function(response) {
                        var tempdata = response.data;

                        //we need a uniform structure for both the students and persons
                        //to do so we take the information in the "person" property of the student
                        // object and put it directly into the student object to match the structure
                        // of the person object
                        angular.forEach(tempdata, function(value, key) {
                            angular.forEach(value['person'], function(v2, k2) {
                                value[k2] = v2;
                                delete value['person'];
                            });

                            value.beltStyle = $scope.getBeltStyle(value.belt);
                        });

                        //add a placeholder image to each person
                        var tempPeople = $scope.transformData(tempdata);

                        //Set checkedIn to true for those already checked in
                        angular.forEach(tempPeople, function(value) {
                            var personID = value['id'];
                            var index = $scope.checkedInPeopleIds.indexOf(personID);
                            if (index !== -1) {
                                value.checkinID = $scope.checkedInPeopleCheckinIds[index];
                                value.checkedIn = true;
                            }
                            $scope.people.push(value);
                        });
                    });
            };

            // Get instructors who are currently checked into the class
            $scope.getInstructorCheckinsForProgram = function() {
                CheckinService.getInstructorCheckinsForProgram($scope.programID, $scope.formatDate($scope.date)).then(
                    function(response) {
                        var tempdata = response.data;

                        angular.forEach(tempdata, function(value, key) {
                            $scope.checkedInInstructorsIds.push(value['person']);
                            $scope.checkedInInstructorsCheckinIds.push(value['id']);
                        });

                        $scope.getInstructors();
                    });
            };

            // Get all of the instructors from the class and determine ones already checked in
            $scope.getInstructors = function() {
                CheckinService.getInstructorsForProgram($stateParams.programID).then(
                    function(response) {
                        var tempdata = response.data;

                        //we need a uniform structure for both the students and persons
                        //to do so we take the information in the "person" property of the student
                        // object and put it directly into the student object to match the structure
                        // of the person object
                        angular.forEach(tempdata, function(value, key) {
                            angular.forEach(value['person'], function(v2, k2) {
                                value[k2] = v2;
                                delete value['person'];
                            });

                            value.beltStyle = $scope.getBeltStyle(value.belt);
                        });

                        //add a placeholder image to each person
                        var tempInstructor = $scope.transformData(tempdata);

                        //Set checkedIn to true for those already checked in
                        angular.forEach(tempInstructor, function(value) {
                            var instructorID = value['id'];
                            var index = $scope.checkedInInstructorsIds.indexOf(instructorID);
                            if (index !== -1) {
                                value.checkinID = $scope.checkedInInstructorsCheckinIds[index];
                                value.checkedIn = true;
                            }
                            $scope.instructors.push(value);
                        });
                    });
            };

            // Load the data for the page
            $scope.getCheckinsForProgram();

            if ($scope.isInstructor) {
                $scope.getInstructorCheckinsForProgram();
            }

            $scope.updateHeader();

            /*
             * Open a prompt to confirm checkin for a person.
             */
            $scope.openCheckinPrompt = function(person) {
                var modalElement = angular.element($document[0].querySelector('#checkin-modal'));

                $scope.selectedPerson = person;

                modalInstance = $uibModal.open({
                    animation: true,
                    windowClass: 'checkin-modal',
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'components/checkin/checkin.modal.html',
                    scope: $scope
                });

                modalInstance.result.then(function(selectedItem) {
                    //$ctrl.selected = selectedItem;
                }, function() {});
            };

            $scope.yes = function() {
                // create checkin using api, backend will auto set the date to today
                CheckinService.createCheckin({ 'person': $scope.selectedPerson.id, 'program': $scope.programID }).then(
                    function(response) {
                        $scope.selectedPerson.checkinID = response.data.id;
                    },
                    function (error) {
                        // This is an okay console log, if someone was watching the console it
                        // explains a 400 that could happen
                        console.log('No need to worry about the above bad request, you just tried ' +
                            'to checkin someone who is already checked in, so we refreshed the ' +
                            'checkins for you');
                        $scope.updateCheckins();
                    });
                modalInstance.dismiss('yes');

                $scope.selectedPerson.checkedIn = true;
            };

            $scope.instructClickCheckin = function(person) {
                // create checkin using api using the selected date
                CheckinService.createCheckin({
                    'person': person.id,
                    'program': $scope.programID,
                    'date': $scope.formatDate($scope.date)
                }).then(
                    function(response) {
                        person.checkinID = response.data.id;
                    },
                    function (error) {
                        // This is an okay console log, if someone was watching the console it
                        // explains a 400 that could happen
                        console.log('No need to worry about the above bad request, you just tried ' +
                            'to checkin someone who is already checked in, so we refreshed the ' +
                            'checkins for you');
                        $scope.updateCheckins();
                    });

                person.checkedIn = true;
            };

            $scope.instructClickDeleteCheckin = function(person) {
                // delete checkin using api

                CheckinService.deleteCheckin(person.checkinID).then(
                    function (response) {
                        person.checkinID = null;
                        person.checkedIn = false;
                    },
                    function (error) {
                        // This is an okay console log, if someone was watching the console it
                        // explains a 404 that could happen
                        console.log('No need to worry about the above not found, you just tried to ' +
                            'delete a checkin that has already been deleted, so we refreshed the ' +
                            'checkins for you');
                        $scope.updateCheckins();
                    });
            };

            $scope.clickCheckinInstructor = function(instructor) {
                // create instructor checkin using api using the selected date
                CheckinService.createInstructorCheckin({
                    'person': instructor.id,
                    'program': $scope.programID,
                    'date': $scope.formatDate($scope.date)
                }).then(
                    function(response) {
                        instructor.checkinID = response.data.id;
                    },
                    function (error) {
                        // This is an okay console log, if someone was watching the console it
                        // explains a 400 that could happen
                        console.log('No need to worry about the above bad request, you just tried ' +
                            'to checkin someone who is already checked in, so we refreshed the ' +
                            'checkins for you');
                        $scope.updateCheckins();
                    });

                instructor.checkedIn = true;
            };

            $scope.clickDeleteInstructorCheckin = function(instructor) {
                // delete instructor checkin using api

                CheckinService.deleteInstructorCheckin(instructor.checkinID).then(
                    function (response) {
                        instructor.checkinID = null;
                        instructor.checkedIn = false;
                    },
                    function (error) {
                        // This is an okay console log, if someone was watching the console it
                        // explains a 404 that could happen
                        console.log('No need to worry about the above not found, you just tried to ' +
                            'delete a checkin that has already been deleted, so we refreshed the ' +
                            'checkins for you');
                        $scope.updateCheckins();
                    });
            };

            $scope.no = function() {
                modalInstance.dismiss('no');
            };
        }
    ]);

})();
