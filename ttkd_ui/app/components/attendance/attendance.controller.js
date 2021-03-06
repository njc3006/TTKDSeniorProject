(function() {
	function AttendanceController(
		$scope,
		$rootScope,
		$stateParams,
		ProgramService,
		AttendanceService,
		StudentsService
	) {
		$rootScope.showCurrentProgram = $stateParams.showCurrentProgram;

		$scope.format = function(date) {
			return moment(date).format('MM/DD/YYYY');
		};

		$scope.openCalendar = function(calendar) {
			calendar.open = true;
		};

		$scope.dataIsEmpty = function() {
			if (angular.isArray($scope.attendanceRecords)) {
				return $scope.attendanceRecords.length === 0;
			} else if (!$scope.attendanceRecords) {
				return true;
			}

			return Object.keys($scope.attendanceRecords).length === 0;
		};

		$scope.loadAttendanceRecords = function() {
			if (Object.prototype.toString.call($scope.attendanceRecords) === '[object Array]') {
				$scope.attendanceRecords = {};
			} else {
				$scope.attendanceRecords = [];
			}

			var filterData = angular.copy($scope.filterData);
			filterData.condensed = filterData.condensed === 'Condensed';
			filterData.page = $scope.pagination.currentPage;

			//If we don't do this, then the service will look for a student with an id of a student name, which will
			//always return zero results
			delete filterData.student;

			if (filterData.startDate) {
				filterData.startDate = filterData.startDate.value;
			}

			if (filterData.endDate) {
				filterData.endDate = filterData.endDate.value;
			}

			if (filterData.condensed) {
				$scope.isLoading = true;
				AttendanceService.getGroupedByStudentRecords(filterData).then(
					function success(groupedRecords) {
						$scope.pagination.totalRecords = Object.keys(groupedRecords).length;
						$scope.attendanceRecords = groupedRecords;
						$scope.isLoading = false;
						$scope.loadingFailed = false;
					},
					function error(error) {
						$scope.loadingFailed = true;
						$scope.isLoading = false;
					}
				);
			} else {
				$scope.isLoading = true;
				AttendanceService.getUngroupedRecords(filterData).then(
					function success(ungroupedRecords) {
						$scope.pagination.totalRecords = ungroupedRecords.count;
						$scope.attendanceRecords = ungroupedRecords.results;
						$scope.isLoading = false;
						$scope.loadingFailed = false;
					},
					function error(error) {
						$scope.loadingFailed = true;
						$scope.isLoading = false;
					}
				);
			}
		};

		$scope.onFilterChange = function() {
			if(!$scope.noMatchName) {
				$scope.pagination.currentPage = 1;
				$scope.loadAttendanceRecords();
			}
		};

		$scope.onStudentNameChange = function() {
			if ($scope.filterData.student === '') {
				delete $scope.filterData.studentIds;
				$scope.noMatchName = false;
				$scope.onFilterChange();
			} else {
				var splitName = $scope.filterData.student.split(' '),
					firstName = splitName[0],
					lastName = splitName[1];

				StudentsService.getStudentIdsFromName(firstName, lastName).then(
					function success(studentIds) {
						$scope.isLoading = true;
						
						if (!lastName) {
							lastName = firstName;
							firstName = '';

							StudentsService.getStudentIdsFromName(firstName, lastName).then(
								function success(studentIdsSecond) {
									$scope.isLoading = true;
									$scope.filterData.studentIds = AttendanceService.arrayUnique(studentIds.concat(studentIdsSecond));
									
									if($scope.filterData.studentIds.length === 0) {
										$scope.noMatchName = true;
										$scope.attendanceRecords = [];
										$scope.isLoading = false;
									}
									else {
										$scope.noMatchName = false;
										$scope.onFilterChange();
									}
								},
								function failure(error) {
									$scope.loadingFailed = true;
									$scope.isLoading = false;
								}
							);
						}
						else {
							$scope.filterData.studentIds = studentIds;

							if($scope.filterData.studentIds.length === 0) {
								$scope.noMatchName = true;
								$scope.attendanceRecords = [];
								$scope.isLoading = false;
							}
							else {
								$scope.noMatchName = false;
								$scope.onFilterChange();
							}
						}
					},
					function failure(error) {
						$scope.loadingFailed = true;
						$scope.isLoading = false;
					}
				);
			}
		};

		$scope.pagination = {
			pageSize: 125,
			currentPage: 1
		};

		$scope.isLoading = false;
		$scope.loadingFailed = false;

		$scope.filterData = {
			condensed: 'Uncondensed',
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
		'$rootScope',
		'$stateParams',
		'ProgramsSvc',
		'AttendanceSvc',
		'StudentsSvc',
		AttendanceController
	]);
})();
