(function() {

  angular.module('ttkdApp.editProgramCtrl', ['ttkdApp.constants'])

    .controller('EditProgramCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ProgramsSvc', 
        function($scope, $rootScope, $state, $stateParams, ProgramsSvc) {
        $rootScope.showCurrentProgram = !$stateParams.hideCurrentProgram;

        $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

        $scope.people = [];
        $scope.instructors = [];
        $scope.program = $stateParams.curProgram;
        $scope.alerts = {
            success: false,
            error : false,
            errorText : ''
        };

        $scope.getInstructors = function() {
            ProgramsSvc.getProgramInstructors().then(
                function(response){
                   $scope.instructors = response.data;
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
                        // $state.go('editPrograms');
                        $scope.alerts.success = true;
                    }, function(error){
                        $scope.alerts.errorText = "Failed to update program data";
                        $scope.alerts.error = true;
                    });

                // ProgramsSvc.updateProgramInstructors($scope.instructors).then(
                //     function(response){
                //         $scope.alerts.success = true;
                //     }, function(error){
                //         $scope.alerts.errorText = "Faield to update instructor data";
                //         $scope.alerts.error = true;
                //     });
            }
        };

        $scope.addInstructor = function(){
            $scope.instructors.push($scope.selected);
            $scope.selected = '';
        };

        $scope.removeInstructor = function(index){
            $scope.instructors.splice(index, 1);
        };

        $scope.updateSelected = function(instructor){
            console.log(instructor);
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