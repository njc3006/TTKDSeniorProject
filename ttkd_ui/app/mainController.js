(function() {

  angular.module('app.mainController', ['app'])

    .controller('mainController', function($scope) {
      $scope.showNav = true;
      $scope.title = 'Home';
    });

})();
