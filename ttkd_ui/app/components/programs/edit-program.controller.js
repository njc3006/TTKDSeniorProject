(function() {

  angular.module('ttkdApp.editProgramCtrl', ['ttkdApp.constants'])

    .controller('EditProgramCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ProgramsSvc', 
        function($scope, $rootScope, $state, $stateParams, ProgramsSvc) {
        $rootScope.showCurrentProgram = !$stateParams.hideCurrentProgram;

        $scope.people = [];             //list of all students to populate the typeahead dropdown
        $scope.instructors = [];        //list of all instructors for a program
        $scope.newInstructors = [];     //list of instructors to be added to a program
        $scope.removeInstructors = [];  //list of instructors to be removed from a program
        $scope.students = [];           //list of all students of a program
        $scope.newStudents = [];        //list of students to be added to a program
        $scope.removeStudents = [];     //list of students to be removed from a program

        $scope.program = $stateParams.curProgram;
        
        $scope.alerts = {
            success: false,
            error : false,
            errorText : ''
        };

        $scope.getInstructors = function() {
            ProgramsSvc.getProgramInstructors($stateParams.curProgram.id).then(
                function(response){
                   $scope.instructors = response.data;
                }, function(error){
                    console.log("failed to get instructors");
                });
        };

        $scope.getPeople = function() {
            ProgramsSvc.getPeople().then(
                function(response){
                    angular.forEach(response.data, function(value){
                        //filtering by full name requires a single property with the full name, which the objects don't include
                        value.name = value.first_name + ' ' + value.last_name;
                    });

                    $scope.people = response.data;

                }, function(error){
                    $scope.alerts.errorText = "Failed to get list of students";
                    $scope.alerts.error = true;
                });
        };

        $scope.getStudents = function() {
            ProgramsSvc.getProgramStudents($stateParams.curProgram.id).then(
                function(response){
                    angular.forEach(response.data, function(value){
                        ProgramsSvc.getStudent(value.person).then(
                            function(student){
                                //in order to remove students from a program we need to know the program registration id, so store it for later use
                                $scope.students.push(
                                    {
                                        registration: value,
                                        student: student.data
                                    }
                                );
                            }, function(studentError){

                            });
                    });

                }, function(error){

                });
        };

        //Main function to update program info, instructors, and students
        $scope.updateProgram = function() {
            $scope.clearAlerts();

            if($scope.program) {
                ProgramsSvc.updateProgram($scope.program, $scope.program.id).then(
                    function(response){
                        console.log("updated program info");
                    }, function(error){
                        console.log("failed to update program info");
                    }
                );

                $scope.updateInstructors();
                $scope.updateStudents();
            }
        };

        //Sends API calls to add/remove instructors from the program
        $scope.updateInstructors = function(){
            angular.forEach($scope.newInstructors, function(value){
                var payload = {
                    person: value.person.id,
                    program: $stateParams.curProgram.id
                };

                ProgramsSvc.updateProgramInstructors(payload).then(
                    function(response){
                        console.log("added new instructor");
                        $scope.newInstructors.splice($scope.newInstructors.indexOf(value), 1);
                    }, function(error){
                        console.log("failed to add new instructor");
                        $scope.alerts.errorText = "Failed to update instructor data";
                    });
            });

            angular.forEach($scope.removeInstructors, function(value){
                ProgramsSvc.removeProgramInstructors(value.id).then(
                    function(response){
                        console.log("successfully removed instructor");
                        $scope.removeInstructors.splice($scope.removeInstructors.indexOf(value), 1);
                    }, function(error){
                        console.log("failed to remove instructor");
                        $scope.alerts.errorText = "Failed to update instructor data";
                    });
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

                ProgramsSvc.updateProgramStudents(payload).then(
                    function(response){
                        console.log("added new student");
                        $scope.newStudents.splice($scope.newStudents.indexOf(value), 1);
                    }, function(error){
                        console.log("failed to add new student");
                        $scope.alerts.errorText = "Failed to update student data";
                    });
            });

            angular.forEach($scope.removeStudents, function(value){
                ProgramsSvc.removeProgramStudents(value.registration.id).then(
                    function(response){
                        console.log("successfully removed student");
                        $scope.removeStudents.splice($scope.removeStudents.indexOf(value), 1);
                    }, function(error){
                        console.log("failed to remove student");
                        $scope.alerts.errorText = "Failed to update student data";
                    });
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

        //Load all of the needed data
        $scope.getPeople();
        $scope.getInstructors();
        $scope.getStudents();

    }]);
})();