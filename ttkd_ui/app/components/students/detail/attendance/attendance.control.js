(function() {
	function StudentAttendanceController($scope, $http, $q, apiHost, SharedDataService) {
		var uniquePrograms = {};

		$scope.loadCheckIns = function(program) {
			var studentId = SharedDataService.getStudentId();

			var requestEndpoint = apiHost + '/api/check-ins/?person=' + studentId;

			if (program && program.id !== undefined) {
				requestEndpoint += '&program=' + program.id;
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
							// Initialize the filteredDates which will potentially be changed and
							// reset multiple times in the future, but checkIns will remain the
							// master list
							$scope.filteredDates = $scope.checkIns;
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

		$scope.loadEnrolledPrograms = function() {
			var studentId = SharedDataService.getStudentId();

			$http.get(apiHost + '/api/registrations/?person=' + studentId).then(
				function(registrations) {
					var discoveredProgramIds = {};

					registrations.data.forEach(function(registration) {
						if (uniquePrograms[registration.program] === undefined) {
							discoveredProgramIds[registration.program] = true;
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

							$scope.enrolledPrograms = registrations.data.map(function(registration) {
								return uniquePrograms[registration.program];
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
			$scope.loadCheckIns($scope.filterData.selectedProgram, $scope.filterData.startDate.value);
		};

		$scope.openStartCalendar = function() {
			$scope.filterData.startDate.open = true;
		};

		$scope.openEndCalendar = function() {
			$scope.filterData.endDate.open = true;
		};

		$scope.filterData = {
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

		$scope.filterDates = function(start, end){
			$scope.filteredDates = [];
			angular.forEach($scope.checkIns, function(value){
				// Start date defin
				if (start){
					if (end){
						// Both start date and end date were defined
						if (value.dateObj >= start && value.dateObj <= end){
							$scope.filteredDates.push(value);
						}
					} else {
						// Just the start date was defined
						if (value.dateObj >= start){
							$scope.filteredDates.push(value);
						}
					}
				} else if (end){
					// Just the end date was defined
					if (value.dateObj <= end){
						$scope.filteredDates.push(value);
					}
				} else {
					// No filters, set to master list
					$scope.filteredDates = $scope.checkIns;
				}
            });
		};

		$scope.checkIns = [];
		$scope.enrolledPrograms = [];
		$scope.filteredDates = [];

		$scope.loadEnrolledPrograms();
		$scope.loadCheckIns();

		$scope.$watch('filterData["startDate"]["value"]', function(newDate) {
			$scope.filterDates(newDate, $scope.filterData.endDate.value);
		});

		$scope.$watch('filterData["endDate"]["value"]', function(newDate) {
			$scope.filterDates($scope.filterData.startDate.value, newDate);
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
