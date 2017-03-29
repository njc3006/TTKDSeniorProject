(function() {

  angular.module('ttkdApp.editProgramCtrl', ['ttkdApp.constants'])

    .controller('EditProgramCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ProgramsSvc', 
        function($scope, $rootScope, $state, $stateParams, ProgramsSvc) {
        $rootScope.showCurrentProgram = !$stateParams.hideCurrentProgram;

        $scope.people = [];
        $scope.instructors = [];
        $scope.newInstructors = [];
        $scope.removeInstructors = [];
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
                    console.log(value.id);
                    ProgramsSvc.removeProgramInstructors(value.id).then(
                        function(response){
                            console.log("successfully removed instructor");
                            $scope.removeInstructors.splice($scope.removeInstructors.indexOf(value), 1);
                        }, function(error){
                            console.log("failed to remove instructor");
                            $scope.alerts.errorText = "Failed to update instructor data";
                        });
                });
            }
        };

        $scope.addInstructor = function(){
            if($scope.selected){
                var instructor = {
                    person: $scope.selected
                };

                $scope.newInstructors.push(instructor);
                $scope.instructors.push(instructor);
                delete $scope.selected;
            }
        };

        $scope.removeInstructor = function(index){
            $scope.removeInstructors.push($scope.instructors[index]);
            $scope.instructors.splice(index, 1);
            console.log($scope.instructors);
        };

        $scope.updateSelected = function(instructor){
            $scope.newInstructor = instructor;
        }

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

    }]);
})();