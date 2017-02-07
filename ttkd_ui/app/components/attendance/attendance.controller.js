(function() {
	function AttendanceController($scope, ProgramService, AttendanceService) {
		$scope.format = function(date) {
			return moment(date).format('MM/DD/YYYY');
		};

		$scope.openCalendar = function(calendar) {
			calendar.open = true;
		};

		$scope.loadAttendanceRecords = function() {
			if (Object.prototype.toString.call($scope.attendanceRecords) === '[object Array]') {
				$scope.attendanceRecords = [];
			} else {
				$scope.attendanceRecords = {};
			}

			var filterData = angular.copy($scope.filterData);
			filterData.page = $scope.pagination.currentPage;

			if (filterData.startDate) {
				filterData.startDate = filterData.startDate.value;
			}

			if (filterData.endDate) {
				filterData.endDate = filterData.endDate.value;
			}

			if (filterData.condensed) {
				/*$scope.isLoading = true;
				AttendanceService.getGroupedByStudentRecords(filterData).then(
					function success(groupedRecords) {
						$scope.attendanceRecords = groupedRecords;
						$scope.isLoading = false;
					},
					function error(error) {
						$scope.loadingFailed = true;
						$scope.isLoading = false;
					}
				);*/
			} else {
				$scope.isLoading = true;
				AttendanceService.getUngroupedRecords(filterData).then(
					function success(ungroupedRecords) {
						$scope.pagination.totalRecords = ungroupedRecords.count;
						$scope.attendanceRecords = ungroupedRecords.results;
						$scope.isLoading = false;
					},
					function error(error) {
						$scope.loadingFailed = true;
						$scope.isLoading = false;
					}
				);
			}
		};

		$scope.pagination = {
			currentPage: 1
		};

		$scope.isLoading = false;
		$scope.loadingFailed = false;

		$scope.filterData = {
			startDate: {
				open: false
			},
			endDate: {
				open: false
			}
		};

		ProgramService.getPrograms().then(function success(response) {
			$scope.allPrograms = response.data;
		}, function failure(error) {
			$scope.loadingFailed = true;
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
