(function() {
	function AttendanceController($scope, ProgramService) {
		$scope.openCalendar = function(calendar) {
			calendar.open = true;
		};

		$scope.filterData = {
			startDate: {},
			endDate: {}
		};

		ProgramService.getPrograms().then(function success(response) {
			$scope.allPrograms = response.data;
		}, function error(error) {

		});
	}

	angular.module('ttkdApp.attendanceCtrl', ['ttkdApp.programsSvc'])
		.controller('AttendanceCtrl', ['$scope', 'ProgramsSvc', AttendanceController]);
})();
