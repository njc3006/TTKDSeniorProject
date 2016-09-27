(function() {

  angular.module('app.navController', ['app'])

    .controller('navController', function($scope, $state) {
    	// returns true if the current router url matches the passed in url
    	// so views can set 'active' on links easily
    	$scope.isUrl = function(url) {
    		if (url === '#') {
          return false;
        } else {
          return ('#' + $state.$current.url.source + '/').indexOf(url + '/') === 0;
        }
    	};

    	$scope.pages = [
    		{
    			name: 'Home',
    			url: '#/'
    		},
    	];
    });

})();
