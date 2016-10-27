(function() {

  angular.module('ttkdApp.mainCtrl', [])
    .controller('MainCtrl', ['$scope', function($scope) {
      $scope.showNav = true;
      $scope.title = 'Tioga Tae Kwon Do';
      $scope.currentClass = 'Tiny Ninjas';
      $scope.loggedIn = false;
    }]);

})();
