(function() {

  angular.module('ttkdApp.checkinCtrl', [])

    .controller('CheckinCtrl', ['$scope', function($scope) {

        $scope.people = [];
        for (var i = 0; i < 30; i++) {
            $scope.people.push(
                {
                    name: 'Person ' + i,
                    picture: 'http://placehold.it/350x350'
                }
            );
        }

        /*
         * Open a prompt to confirm checkin for a person.
         */
        $scope.openCheckinPrompt = function(person) {

        };

    }]);

})();
