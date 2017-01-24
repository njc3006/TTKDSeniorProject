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

		$scope.loadAttendanceRecords = function() {
			var filterData = $scope.filterData;

			if ($scope.filterData.startDate) {
				filterData.startDate = $scope.filterData.startDate.value;
			}

			if ($scope.filterData.endDate) {
				filterData.endDate = $scope.filterData.endDate.value;
			}

			AttendanceService.getGroupedByStudentRecords(filterData).then(function success(uniqueStudents) {
				$scope.attendanceRecords = uniqueStudents;
				$scope.displayStudents = $scope.attendanceRecords;
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

		$scope.$watch('filterData["student"]', function(newStudentName) {
			if (!$scope.filterData.student) return;

			var tokens = newStudentName.split();

			if (tokens.length === 1) {
				var name = tokens[0];

				$scope.displayStudents = filterObject($scope.attendanceRecords, function(record) {
					return record.firstName.indexOf(name) !== -1 || record.lastName.indexOf(name) !== -1;
				});
			} else if (tokens.length === 2) {
				var firstName = tokens[0], lastName = tokens[1];

				$scope.displayStudents = filterObject($scope.attendanceRecords, function(record) {
					return record.firstName.toLowerCase() === firstName.toLowerCase() ||
						record.lastName.toLowerCase() === lastName.toLowerCase();
				});
			}
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
