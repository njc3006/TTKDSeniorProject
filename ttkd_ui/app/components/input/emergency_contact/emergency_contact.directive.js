(function() {
	angular.module('ttkdApp.emergencyContacts', [])
		.directive('emergencyContactInput', function() {
			return {
				restrict: 'E',
				require: 'ngModel',
				replace: 'true',
				scope: {
					ngModel: '=ngModel',
					required: '=required'
				},
				templateUrl: 'components/input/emergency_contact/emergency_contact.html'
			};
		});
})();
