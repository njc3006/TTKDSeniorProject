(function() {

  angular.module('ttkdApp.editProgramCtrl', ['ttkdApp.constants'])

    .controller('EditProgramCtrl', ['$scope', '$rootScope', '$q', '$window', '$state', '$stateParams', 'ProgramsSvc', 
        function($scope, $rootScope, $q, $window, $state, $stateParams, ProgramsSvc) {
        $rootScope.showCurrentProgram = !$stateParams.hideCurrentProgram;

        $scope.people = [];             //list of all students to populate the typeahead dropdown
        $scope.instructors = [];        //list of all instructors for a program
        $scope.newInstructors = [];     //list of instructors to be added to a program
        $scope.removeInstructors = [];  //list of instructors to be removed from a program
        $scope.registrations = [];           //list of all students of a program
        $scope.newStudents = [];        //list of students to be added to a program
        $scope.removeRegistrations = [];     //list of students to be removed from a program

        $scope.promises = [];           //contains promises for adding/deleting/updating information
        $scope.loadingPromises = [];    //contains promises for getting information

        $scope.program = $stateParams.curProgram;
        $scope.promiseError = false;
        $scope.loaded = false;
        
        $scope.alerts = {
            success: false,
            error : false,
            errorText : ''
        };

        $scope.getInstructors = function() {
            $scope.loadingPromises.push(
                ProgramsSvc.getProgramInstructors($stateParams.curProgram.id).then(
                    function(response){
                       $scope.instructors = response.data;
                    }, function(error){
                        $scope.alerts.errorText = 'Failed to get program\'s instructors';
                        $scope.alerts.error = true;
                    })
            );
        };

        $scope.getPeople = function() {
            $scope.loadingPromises.push(
                ProgramsSvc.getPeople().then(
                    function(response){
                        angular.forEach(response.data, function(value){
                            //filtering by full name requires a single property with the full name, which the objects don't include
                            value.name = value.first_name + ' ' + value.last_name;
                        });

                        $scope.people = response.data;

                    }, function(error){
                        $scope.alerts.errorText = 'Failed to get master list of students';
                        $scope.alerts.error = true;
                    })
            );
        };

        $scope.getStudents = function() {

            var promise = ProgramsSvc.getProgramStudents($stateParams.curProgram.id).then(
                function(response){
                    $scope.registrations = response.data;
                }, function(error){
                    $scope.alerts.errorText = 'Failed to get program\'s students';
                    $scope.alerts.error = true;
                }
            );

            $scope.loadingPromises.push(promise);
        };

        //Load all of the needed data
        $scope.loadInfo = function(){
            $scope.getPeople();
            $scope.getInstructors();
            $scope.getStudents();

            $q.all($scope.loadingPromises).then(function(){
                $scope.loaded = true;
            }); 
        };

        //Main function to update program info, instructors, and students
        $scope.updateProgram = function() {
            $scope.clearAlerts();
            $scope.promises = [];    
            $scope.promiseError = false;

            if($scope.program) {
                $scope.promises.push(
                    ProgramsSvc.updateProgram($scope.program, $scope.program.id).then(
                        function(response){

                        }, function(error){
                            $scope.alerts.errorText = "Failed to update program info";
                            $scope.promiseError = true;
                        }
                    )
                );

                $scope.updateInstructors();
                $scope.updateStudents();

                $q.all($scope.promises).then(function(){
                    if($scope.promiseError) {
                        $scope.alerts.error = true;
                        $scope.alerts.success = false;
                    } else {
                        $scope.alerts.success = true;
                        $scope.alerts.error = false;
                        $window.scrollTo(0, 0);
                        $scope.backNavigate();
                    }
                });
            }
        };

        //Sends API calls to add/remove instructors from the program
        $scope.updateInstructors = function(){
            angular.forEach($scope.newInstructors, function(value){
                var payload = {
                    person: value.person.id,
                    program: $stateParams.curProgram.id
                };

                $scope.promises.push(
                    ProgramsSvc.updateProgramInstructors(payload).then(
                        function(response){
                            $scope.newInstructors.splice($scope.newInstructors.indexOf(value), 1);
                        }, function(error){
                            $scope.alerts.errorText = 'Failed to add new instructor';
                            $scope.promiseError = true;
                        })
                );
            });

            angular.forEach($scope.removeInstructors, function(value){
                if(value && value.id){
                    $scope.promises.push(
                        ProgramsSvc.removeProgramInstructors(value.id).then(
                            function(response){
                                $scope.removeInstructors.splice($scope.removeInstructors.indexOf(value), 1);
                            }, function(error){
                                $scope.alerts.errorText = 'Failed to remove instructor';
                                $scope.promiseError = true;
                            })
                        );
                }
            });
        };

        //Sends API calls to add/remove students from the program
        $scope.updateStudents = function(){
            angular.forEach($scope.newStudents, function(value){
                var payload = {
                    person: value.student.id,
                    program: $stateParams.curProgram.id,
                    is_partial: false
                };

                $scope.promises.push(
                    ProgramsSvc.updateProgramStudents(payload).then(
                        function(response){
                            $scope.newStudents.splice($scope.newStudents.indexOf(value), 1);
                        }, function(error){
                            $scope.alerts.errorText = 'Failed to add new student';
                            $scope.promiseError = true;
                        })
                );
            });

            angular.forEach($scope.removeRegistrations, function(value){
                if(value && value.id){
                    $scope.promises.push(
                        ProgramsSvc.removeProgramStudents(value.id).then(
                            function(response){
                                $scope.removeRegistrations.splice($scope.removeRegistrations.indexOf(value), 1);
                            }, function(error){
                                $scope.alerts.errorText = 'Failed to remove student';
                                $scope.promiseError = true;
                            })
                        );
                }
            });
        };

        $scope.addInstructor = function(){
            $scope.clearAlerts();

            if($scope.selectedInstructor){

                var alreadyInstructing = false;

                angular.forEach($scope.instructors, function(value){
                    if (value.person.id === $scope.selectedInstructor.id){
                        alreadyInstructing = true;
                    }
                });

                if (alreadyInstructing) {
                    $scope.alerts.error = true;
                    $scope.alerts.errorText = 'That Student Already Instructs this Program';
                } else {

                    // Lets figure out if they are in the remove list, if they are then just
                    // put the element from the remove list back
                    var indexToRemove = -1;
                    angular.forEach($scope.removeInstructors, function(value){
                        if (value.person.id === $scope.selectedInstructor.id){
                            // -1 if not found
                            indexToRemove = $scope.removeInstructors.indexOf(value);

                            // Add it back in to the list of registrations
                            $scope.instructors.push(value);
                        }
                    });
                    if (indexToRemove !== -1){
                        $scope.removeInstructors.splice(indexToRemove, 1);
                    } else {
                        // If we did't find it in the remove, then we must be good to add it to the new
                        var instructor = {
                        person: $scope.selectedInstructor
                        };

                        $scope.newInstructors.push(instructor);
                        $scope.instructors.push(instructor);
                    }
                }
                delete $scope.selectedInstructor; //clear the input field
            }
        };

        $scope.removeInstructor = function(index){
            var instructor = $scope.instructors[index];

            if (instructor.id){
                // Only a real registration with an id has to be removed, if it doesn't have
                // an id, then it doesn't exist in the api yet
                $scope.removeInstructors.push(instructor);
            }

            // Next let's figure out if this person is in the list to add to the api
            // if they are, we need to remove them
            var indexToRemove = -1;
            angular.forEach($scope.newInstructors, function(value){
                if (value.person.id === instructor.person.id){
                    // -1 if not found
                    indexToRemove = $scope.newInstructors.indexOf(value);
                }
            });
            if (indexToRemove !== -1){
                $scope.newInstructors.splice(indexToRemove, 1);
            }

            $scope.instructors.splice(index, 1);
        };

        $scope.addStudent = function(){
            $scope.clearAlerts();

            if($scope.selectedStudent){

                var alreadyRegistered = false;

                angular.forEach($scope.registrations, function(value){
                    if (value.person.id === $scope.selectedStudent.id){
                        alreadyRegistered = true;
                    }
                });

                if (alreadyRegistered){
                    $scope.alerts.error = true;
                    $scope.alerts.errorText = 'That Student Already Belongs To this Program';
                } else {
                    delete $scope.selectedStudent.name; //this isn't part of the schema and is only used on the front end

                    // Lets figure out if they are in the remove list, if they are then just
                    // put the element from the remove list back
                    var indexToRemove = -1;
                    angular.forEach($scope.removeRegistrations, function(value){
                        if (value.person.id === $scope.selectedStudent.id){
                            // -1 if not found
                            indexToRemove = $scope.removeRegistrations.indexOf(value);

                            // Add it back in to the list of registrations
                            $scope.registrations.push(value);
                        }
                    });
                    if (indexToRemove !== -1){
                        $scope.removeRegistrations.splice(indexToRemove, 1);
                    } else {
                        // If we did't find it in the remove, then we must be good to add it to the new
                        $scope.newStudents.push({student: $scope.selectedStudent});
                        $scope.registrations.push({person: $scope.selectedStudent});
                    }
                }
                delete $scope.selectedStudent; //clear the input field
            }
        };

        $scope.removeStudent = function(index){
            var registration = $scope.registrations[index];

            if (registration.id){
                // Only a real registration with an id has to be removed, if it doesn't have
                // an id, then it doesn't exist in the api yet
                $scope.removeRegistrations.push(registration);
            }

            // Next let's figure out if this person is in the list to add to the api
            // if they are, we need to remove them
            var indexToRemove = -1;
            angular.forEach($scope.newStudents, function(value){
                if (value.student.id === registration.person.id){

                    // -1 if not found
                    indexToRemove = $scope.newStudents.indexOf(value);
                }
            });
            if (indexToRemove !== -1){
                $scope.newStudents.splice(indexToRemove, 1);
            }

            $scope.registrations.splice(index, 1);
        };

        $scope.clearAlerts = function() {
            $scope.alerts.success = false;
            $scope.alerts.error = false;
            $scope.alerts.errorText = '';
        };

        $scope.backNavigate = function() {
            var shouldBackNavigate = true;

            if ($scope.removeInstructors.length > 0 ||  $scope.removeRegistrations.length > 0
                || $scope.newInstructors.length > 0 ||  $scope.newStudents.length > 0) {
                shouldBackNavigate = confirm('There are unsaved changes, are you sure you wish to leave?');
            }

            if (shouldBackNavigate){
                $state.go('editPrograms');
            }
        };

        $scope.loadInfo();
    }]);
})();