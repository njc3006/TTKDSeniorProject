(function() {

  angular.module('ttkdApp.checkinCtrl', ['ttkdApp'])

    .controller('CheckinCtrl', function($scope) {

        $scope.people = [];
        for (var i = 0; i < 30; i++) {
            $scope.people.push(
                {
                    name: 'Person ' + i,
                    picture: 'http://placehold.it/350x350'
                }
            );
        }

    });

})();
