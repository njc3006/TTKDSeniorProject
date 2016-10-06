(function() {

  angular.module('ttkdApp.mainCtrl', [])

    .controller('MainCtrl', ['$scope', function($scope) {
      $scope.showNav = true;
      $scope.title = 'Home';
      $scope.currentClass = 'Tiny Ninjas';
    }]);

})();
