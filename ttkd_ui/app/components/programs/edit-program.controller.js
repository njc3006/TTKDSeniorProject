(function() {

  angular.module('ttkdApp.editProgramCtrl', ['ttkdApp.constants'])

    .controller('EditProgramCtrl', ['$scope', '$rootScope', '$q', '$window', '$state', '$stateParams', 'ProgramsSvc', 
        function($scope, $rootScope, $q, $window, $state, $stateParams, ProgramsSvc) {
        $rootScope.showCurrentProgram = !$stateParams.hideCurrentProgram;

        $scope.people = [];             //list of all students to populate the typeahead dropdown
        $scope.instructors = [];        //list of all instructors for a program
        $scope.newInstructors = [];     //list of instructors to be added to a program
        $scope.removeInstructors = [];  //list of instructors to be removed from a program
        $scope.students = [];           //list of all students of a program
        $scope.newStudents = [];        //list of students to be added to a program
        $scope.removeStudents = [];     //list of students to be removed from a program

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
            var promise1, promise2;
            var tempStudents = [];

            promise1 = ProgramsSvc.getProgramStudents($stateParams.curProgram.id).then(
                function(response){
                    tempStudents = response.data;
                }, function(error){
                    $scope.alerts.errorText = 'Failed to get program\'s students';
                    $scope.alerts.error = true;
                }
            );

            promise2 = promise1.then(function(){
                angular.forEach(tempStudents, function(value){
                    var newPromise = ProgramsSvc.getStudent(value.person).then(
                        function(student){
                            //in order to remove students from a program we need to know the program registration id, so store it for later use
                            $scope.students.push(
                                {
                                    registration: value,
                                    student: student.data
                                }
                            );
                        }, function(studentError){
                            $scope.alerts.errorText = 'Failed to get program\'s students';
                            $scope.alerts.error = true;
                        }
                    );

                    $scope.loadingPromises.push(newPromise);
                });
            });

            $scope.loadingPromises.push(promise1);
            $scope.loadingPromises.push(promise2);
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
                if(value){
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

            angular.forEach($scope.removeStudents, function(value){
                if(value && value.registration){
                    $scope.promises.push(
                        ProgramsSvc.removeProgramStudents(value.registration.id).then(
                            function(response){
                                $scope.removeStudents.splice($scope.removeStudents.indexOf(value), 1);
                            }, function(error){
                                $scope.alerts.errorText = 'Failed to remove student';
                                $scope.promiseError = true;
                            })
                        );
                }
            });
        };

        $scope.addInstructor = function(){
            if($scope.selectedInstructor){
                var instructor = {
                    person: $scope.selectedInstructor
                };

                $scope.newInstructors.push(instructor);
                $scope.instructors.push(instructor);
                delete $scope.selectedInstructor; //clear the input field
            }
        };

        $scope.removeInstructor = function(index){
            $scope.removeInstructors.push($scope.instructors[index]);
            $scope.instructors.splice(index, 1);
        };

        $scope.addStudent = function(){
            if($scope.selectedStudent){
                delete $scope.selectedStudent.name; //this isn't part of the schema and is only used on the front end
                $scope.newStudents.push({student: $scope.selectedStudent});
                $scope.students.push({student: $scope.selectedStudent});
                delete $scope.selectedStudent; //clear the input field
            }
        };

        $scope.removeStudent = function(index){
            $scope.removeStudents.push($scope.students[index]);
            $scope.students.splice(index, 1);
        };

        $scope.clearAlerts = function() {
            $scope.alerts.success = false;
            $scope.alerts.error = false;
            $scope.alerts.errorText = '';
        };

        $scope.backNavigate = function() {
            $state.go('editPrograms');
        };


        $scope.loadInfo();
    }]);
})();