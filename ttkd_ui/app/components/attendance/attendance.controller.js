(function() {
	function AttendanceController($scope, ProgramService, AttendanceService) {
		$scope.format = function(date) {
			return moment(date, 'YYYY-MM-DD').format('MM/DD/YYYY');
		};

		$scope.openCalendar = function(calendar) {
			calendar.open = true;
		};

		$scope.loadAttendanceRecords = function() {
			AttendanceService.getGroupedByStudentRecords($scope.filterData).then(function success(uniqueStudents) {
				//console.log(uniqueStudents);
				$scope.attendanceRecords = uniqueStudents;
			}, function failure(error) {
				console.log(error);
			});
		};

		$scope.filterData = {
			startDate: {},
			endDate: {}
		};

		$scope.$watch('filterData["startDate"]["value"]', function(newDate) {
			$scope.loadAttendanceRecords();
		});

		$scope.$watch('filterData["endDate"]["value"]', function(newDate) {
			$scope.loadAttendanceRecords();
		});

		$scope.$watch('filterData["program"]', function(newProgram) {
			$scope.loadAttendanceRecords();
		});

		$scope.$watch('filterData["student"]', function(newProgram) {
			$scope.loadAttendanceRecords();
		});

		ProgramService.getPrograms().then(function success(response) {
			$scope.allPrograms = response.data;
		}, function failure(error) {

		});

		$scope.loadAttendanceRecords();
	}

	angular.module('ttkdApp.attendanceCtrl', ['ttkdApp.programsSvc', 'ttkdApp.attendanceService'])
		.controller('AttendanceCtrl', ['$scope', 'ProgramsSvc', 'AttendanceSvc', AttendanceController]);
})();
