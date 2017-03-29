(function() {

  angular.module('ttkdApp.editProgramCtrl', ['ttkdApp.constants'])

    .controller('EditProgramCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ProgramsSvc', 
        function($scope, $rootScope, $state, $stateParams, ProgramsSvc) {
        $rootScope.showCurrentProgram = !$stateParams.hideCurrentProgram;

        $scope.people = [];
        $scope.instructors = [];
        $scope.newInstructors = [];
        $scope.removeInstructors = [];
        $scope.students = [];
        $scope.newStudents = [];
        $scope.removeStudents = [];

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
                    var data = response.data;

                    angular.forEach(data, function(value){
                        value.name = value.first_name + ' ' + value.last_name;
                    });

                    $scope.people = data;

                }, function(error){
                    $scope.alerts.errorText = "Failed to get list of students";
                    $scope.alerts.error = true;
                });
        };

        $scope.getStudents = function() {
            ProgramsSvc.getProgramStudents($stateParams.curProgram.id).then(
                function(response){
                    var data = response.data;

                    angular.forEach(data, function(value){
                        ProgramsSvc.getStudent(value.person).then(
                            function(student){
                                $scope.students.push(student.data);
                            }, function(studentError){

                            });
                    });

                }, function(error){

                });
        };

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

        $scope.updateStudents = function(){
            angular.forEach($scope.newStudents, function(value){
                
                console.log(value);
                var payload = {
                    person: value.id,
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
               
                console.log(value);
                ProgramsSvc.removeProgramStudents(value.id).then(
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
                delete $scope.selectedInstructor;
            }
        };

        $scope.removeInstructor = function(index){
            $scope.removeInstructors.push($scope.instructors[index]);
            $scope.instructors.splice(index, 1);
        };

        $scope.addStudent = function(){
            if($scope.selectedStudent){
                delete $scope.selectedStudent.name;
                $scope.newStudents.push($scope.selectedStudent);
                $scope.students.push($scope.selectedStudent);
                delete $scope.selectedStudent;
            }
        };

        $scope.removeStudent = function(index){
            $scope.removeStudents.push($scope.students[index]);
            $scope.students.splice(index, 1);
        };

        // $scope.updateSelected = function(value, type){
        //     console.log("hit");
        //     if(type === 'instructor'){
        //         $scope.newInstructor = value;
        //     } else {
        //         $scope.newStudent = value;
        //     }
        // };

        $scope.clearAlerts = function() {
            $scope.alerts.success = false;
            $scope.alerts.error = false;
            $scope.alerts.errorText = '';
        };

        $scope.backNavigate = function() {
            $state.go('editPrograms');
        };

        $scope.getPeople();
        $scope.getInstructors();
        $scope.getStudents();

    }]);
})();