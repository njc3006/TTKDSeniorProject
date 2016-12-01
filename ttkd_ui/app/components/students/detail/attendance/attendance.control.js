(function() {
	function StudentAttendanceController($scope, $http, $q, apiHost, SharedDataService) {
		var uniquePrograms = {};

		$scope.loadCheckIns = function(programId, date) {
			var studentId = SharedDataService.getStudentId();

			var requestEndpoint = apiHost + '/api/check-ins/?person=' + studentId;

			if (programId !== undefined) {
				requestEndpoint += '&program=' + programId;
			}

			if (date !== undefined) {
				requestEndpoint += '&date=' + moment(date, 'MM/DD/YYYY').format('YYYY-MM-DD');
			}

			$http.get(requestEndpoint).then(
				function(checkinsResponse) {
					var discoveredProgramIds = {};

					checkinsResponse.data.forEach(function(checkIn) {
						if (uniquePrograms[checkIn.program] === undefined) {
							discoveredProgramIds[checkIn.program] = true;
						}
					});

					var programPromises = [];

					angular.forEach(discoveredProgramIds, function(value, key) {
						programPromises.push($http.get(apiHost + '/api/programs/' + key + '/'));
					});

					$q.all(programPromises).then(
						function(programResponses) {
							programResponses.forEach(function(resp) {
								uniquePrograms[resp.data.id] = resp.data;
							});

							$scope.checkIns = checkinsResponse.data.map(function(checkIn) {
								return {
									id: checkIn.id,
									dateObj: moment(checkIn.date, 'YYYY-MM-DD').toDate(),
									formattedDate: moment(checkIn.date, 'YYYY-MM-DD').format('MM/DD/YYYY'),
									program: uniquePrograms[checkIn.program].name
								};
							});

							$scope.checkedInPrograms = Object.keys(uniquePrograms).map(function(programId) {
								return uniquePrograms[programId];
							});
						},
						function(errors) {
							// TODO: Error Handling
						}
					);
				},
				function(error) {
					// TODO: Error Handling
				}
			);
		};

		$scope.onProgramChange = function() {
			$scope.loadCheckIns($scope.filterData.selectedProgram, $scope.filterData.date.value);
		};

		$scope.openCalendar = function() {
			$scope.filterData.date.open = true;
		};

		$scope.filterData = {
			date: {
				open: false,
				options: {
					maxDate: new Date()
				}
			}
		};

		$scope.checkIns = [];
		$scope.enrolledPrograms = [];

		$scope.loadCheckIns();

		$scope.$watch('filterData["date"]["value"]', function(newDate) {
			$scope.loadCheckIns($scope.filterData.selectedProgram, newDate);
		});
	}

	angular.module('ttkdApp.studentDetailCtrl')
		.controller('StudentAttendanceCtrl', [
			'$scope',
			'$http',
			'$q',
			'apiHost',
			'SharedDataSvc',
			StudentAttendanceController
		]);
})();
