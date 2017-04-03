(function() {
	angular.module('ttkdApp.pictureDir', [])
		.directive('picture', function() {
			return {
				restrict: 'E',
				templateUrl: 'common/picture/picture.directive.html',
				scope: {
					source: '=',
					style: '='
				}
			};
		});
})();
