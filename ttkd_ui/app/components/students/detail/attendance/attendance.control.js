(function() {
	function StudentAttendanceController($scope, $http) {
		$scope.openCalendar = function(date) {
			date.open = true;
		};

		$scope.datePickerOptions = {
			maxDate: new Date()
		};

		$scope.filterDate = {
			start: {
				open: false
			},
			end: {
				open: false
			}
		};
	}

	angular.module('ttkdApp.studentDetailCtrl')
		.controller('StudentAttendanceCtrl', ['$scope', '$http', StudentAttendanceController]);
})();
