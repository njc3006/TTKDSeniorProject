(function() {
	function AttendanceController($scope, ProgramService, AttendanceService) {
		$scope.format = function(date) {
			return moment(date).format('MM/DD/YYYY');
		};

		$scope.numPrograms = function(programs) {
			return Object.keys(programs).length;
		}

		$scope.openCalendar = function(calendar) {
			calendar.open = true;
		};

		function loadAttendanceRecords() {
			var filterData = angular.copy($scope.filterData);

			if (filterData.startDate) {
				filterData.startDate = filterData.startDate.value;
			}

			if (filterData.endDate) {
				filterData.endDate = filterData.endDate.value;
			}

			if (filterData.condensed) {
				AttendanceService.getGroupedByStudentRecords(filterData).then(
					function success(groupedRecords) {
						console.log(groupedRecords);
						$scope.attendanceRecords = groupedRecords;
					},
					function error(error) {

					}
				);
			} else {
				AttendanceService.getUngroupedRecords(filterData).then(
					function success(ungroupedRecords) {
						//console.log(ungroupedRecords);
						$scope.attendanceRecords = ungroupedRecords;
					},
					function error(error) {

					}
				);
			}
		}

		$scope.filterData = {
			startDate: {
				open: false
			},
			endDate: {
				open: false
			}
		};

		$scope.$watch('filterData["condensed"]', function(isCondensed) {
			loadAttendanceRecords();
		});

		$scope.$watch('filterData["startDate"]["value"]', function(newDate) {
			loadAttendanceRecords();
		});

		$scope.$watch('filterData["endDate"]["value"]', function(newDate) {
			loadAttendanceRecords();
		});

		$scope.$watch('filterData["program"]', function(newProgram) {
			loadAttendanceRecords();
		});

		$scope.$watch('filterData["student"]', function(newStudentName) {
			loadAttendanceRecords();
		});

		ProgramService.getPrograms().then(function success(response) {
			$scope.allPrograms = response.data;
		}, function failure(error) {

		});

		loadAttendanceRecords();
	}

	angular.module('ttkdApp.attendanceCtrl', [
		'ttkdApp.programsSvc',
		'ttkdApp.attendanceService',
		'ttkdApp.studentsService'
	]).controller('AttendanceCtrl', [
		'$scope',
		'ProgramsSvc',
		'AttendanceSvc',
		'StudentsSvc',
		AttendanceController
	]);
})();
