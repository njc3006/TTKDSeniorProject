(function() {
	function AttendanceController($scope, ProgramService, AttendanceService) {
		function filterObject(object, pred) {
			var result = {};

			for (var key in object) {
        if (object.hasOwnProperty(key) && !pred(object[key])) {
          result[key] = object[key];
        }
	    }

	    return result;
		}

		$scope.format = function(date) {
			return moment(date, 'YYYY-MM-DD').format('MM/DD/YYYY');
		};

		$scope.openCalendar = function(calendar) {
			calendar.open = true;
		};

		function loadAttendanceRecords() {
			var filterData = $scope.filterData;

			if ($scope.filterData.startDate) {
				filterData.startDate = $scope.filterData.startDate.value;
			}

			if ($scope.filterData.endDate) {
				filterData.endDate = $scope.filterData.endDate.value;
			}

			if ($scope.filterData.condensed) {
				AttendanceService.getGroupedByStudentRecords(filterData).then(
					function success(groupedRecords) {
						$scope.attendanceRecords = groupedRecords;
					},
					function error(error) {

					}
				);
			} else {
				AttendanceService.getUngroupedRecords(filterData).then(
					function success(ungroupedRecords) {
						$scope.attendanceRecords = ungroupedRecords;
					},
					function error(error) {

					}
				);
			}
		};

		$scope.filterData = {
			startDate: {},
			endDate: {}
		};

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

		$scope.loadAttendanceRecords();
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
