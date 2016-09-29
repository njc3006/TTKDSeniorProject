(function() {

  angular.module('ttkdApp.mainController', ['ttkdApp'])

    .controller('mainController', function($scope) {
      $scope.showNav = true;
      $scope.title = 'Home';
    });

})();
