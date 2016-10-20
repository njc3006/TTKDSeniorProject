(function() {

  angular.module('ttkdApp.homeCtrl', [])
    .controller('HomeCtrl', ['$scope', function($scope) {

    	$scope.activeClass = {
    		name: 'Tiny Turtles',
    		id: 0
    	};

    }]);

})();
