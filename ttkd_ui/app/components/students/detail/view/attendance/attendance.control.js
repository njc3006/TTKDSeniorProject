(function() {
	function StudentAttendanceController(
		$scope,
		SharedDataService,
		StudentsService,
		AttendanceService
	) {
		var studentId = SharedDataService.getStudentId();

		$scope.loadCheckIns = function() {
			AttendanceService.getUngroupedRecords({
				student: studentId,
				page: $scope.filterData.page,
				program: $scope.filterData.selectedProgram,
				startDate: $scope.filterData.startDate.value,
				endDate: $scope.filterData.endDate.value
			}).then(
				function onSuccess(ungroupedRecords) {
					$scope.pagination.totalRecords = ungroupedRecords.count;

					$scope.checkIns = ungroupedRecords.results.map(function(checkIn) {
						checkIn.date = moment(checkIn.date, 'YYYY-MM-DD').format('MM/DD/YYYY');
						return checkIn;
					});
				},
				function onFailure(error) {
					$scope.checkInsLoadFailed = true;
				}
			);
		};

		$scope.openStartCalendar = function() {
			$scope.filterData.startDate.open = true;
		};

		$scope.openEndCalendar = function() {
			$scope.filterData.endDate.open = true;
		};

		$scope.enrolledPrograms = [];

		$scope.pagination = {
			pageSize: 125
		};

		$scope.filterData = {
			page: 1,
			startDate: {
				open: false,
				options: {
					maxDate: new Date()
				}
			},
			endDate: {
				open: false,
				options: {
					maxDate: new Date()
				}
			}
		};

		StudentsService.getStudentRegistrations(studentId).then(
			function onSuccess(response) {
				$scope.enrolledPrograms = response.data;
				$scope.loadCheckIns();
			},
			function onError(error) {
				$scope.programLoadFailed = true;
			}
		);
	}

	angular.module('ttkdApp.studentDetailCtrl')
		.controller('StudentAttendanceCtrl', [
			'$scope',
			'SharedDataSvc',
			'StudentsSvc',
			'AttendanceSvc',
			StudentAttendanceController
		]);
})();
