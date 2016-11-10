(function() {
	function StudentAttendanceController($scope, $http, apiHost, SharedDataService) {
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

		var studentId = SharedDataService.getStudentId();

		$http.get(apiHost + '/api/check-ins/?person=' + studentId).then(
			function(response) {
				var uniqueProgramIds = {};

				response.data.forEach(function(checkIn) {
					if (uniqueProgramIds[checkIn.program] === undefined) {
						uniqueProgramIds[checkIn.program] = true;
					}
				});

				// TODO: For each unique program get a 

				$scope.checkIns = response.data.map(function(checkIn) {
					checkIn.date = moment(checkIn.date, 'YYYY-MM-DD').format('MM/DD/YYYY');
					return checkIn;
				});
			},
			function(error) {

			}
		)
	}

	angular.module('ttkdApp.studentDetailCtrl')
		.controller('StudentAttendanceCtrl', ['$scope', '$http', 'apiHost', 'SharedDataSvc', StudentAttendanceController]);
})();
