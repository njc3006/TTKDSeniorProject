(function() {
	angular.module('ttkdApp.telLinkDir', [])
		.directive('telLink', function() {
			return {
				restrict: 'E',
				templateUrl: 'components/students/detail/tel_link/tel_link.html',
				scope: {
					phoneNumber: '=phone',
					label: '='
				},
				controller: ['$scope', function($scope) {
					$scope.formatPhoneNumberForDisplay = function(phone) {
						if (phone === undefined) {
							return null;
						}

						return '(' + phone.substring(0, 3) + ') ' + phone.substring(3, 6) + '-' + phone.substring(6);
					};

					$scope.formatPhoneNumberForLink = function(phone) {
						if (phone === undefined) {
							return null;
						}

						return '+1-' + phone.substring(0, 3) + '-' + phone.substring(3, 6) + '-' + phone.substring(6);
					};
				}]
			};
		});
})();
