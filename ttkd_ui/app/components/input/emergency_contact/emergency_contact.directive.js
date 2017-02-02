(function() {
	angular.module('ttkdApp.emergencyContactDir', ['ngMask'])
		.directive('emergencyContactInput', function() {
			return {
				restrict: 'E',
				require: 'ngModel',
				templateUrl: 'components/input/emergency_contact/emergency_contact.directive.html',
				scope: {
					ngModel: '=',
					required: '='
				}
			};
		});
})();
