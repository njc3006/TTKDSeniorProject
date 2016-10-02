(function() {

	function NavController($scope, $state) {
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
	}

	NavController.$inject = ['$scope', '$state'];
  angular.module('ttkdApp.navController', [])
    .controller('navController', NavController);
})();
