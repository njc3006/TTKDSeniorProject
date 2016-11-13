(function() {
	function StudentAttendanceController($scope, $http, $q, apiHost, SharedDataService) {
		var uniquePrograms = {};

		$scope.loadCheckIns = function() {
			var studentId = SharedDataService.getStudentId();

			$http.get(apiHost + '/api/check-ins/?person=' + studentId).then(
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
									date: moment(checkIn.date, 'YYYY-MM-DD').format('MM/DD/YYYY'),
									program: uniquePrograms[checkIn.program].name
								};
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

		$scope.openCalendar = function(date) {
			date.open = true;
		};

		$scope.datePickerOptions = {
			maxDate: new Date()
		};

		$scope.filterDate = {
			start: {
				open: false
			},
			end: {
				open: false
			}
		};

		$scope.checkIns = [];

		$scope.enrolledPrograms = [];
		$scope.selectedProgram = {};

		$scope.loadEnrolledPrograms();
		$scope.loadCheckIns();
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
