(function() {

  angular.module('ttkdApp.mainCtrl', ['ttkdApp'])

    .controller('mainCtrl', function($scope) {
      $scope.showNav = true;
      $scope.title = 'Home';
      $scope.currentClass = "Tiny Ninjas";
    });

})();
