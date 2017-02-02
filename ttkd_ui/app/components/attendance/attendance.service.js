(function() {
	function AttendanceService($http, $q, apiHost, StudentsService) {
		return {
			getUngroupedRecords: function(filterData) {
				return $q(function(resolve, reject) {

				});
			},

			getGroupedByStudentRecords: function(filterData) {
				return $q(function(resolve, reject) {
					var requestConfig = {
						params: {
							program: filterData.program
						}
					};

					$http.get(apiHost + '/api/check-ins-detailed/', requestConfig).then(function success(response) {
						var uniqueStudents = {};

						response.data.forEach(function(attendanceRecord) {
							if (filterData.endDate && moment(attendanceRecord.date, 'YYYY-MM-DD').isAfter(filterData.endDate)) {
								return;
							} else if (filterData.startDate && moment(attendanceRecord.date, 'YYYY-MM-DD').isBefore(filterData.startDate)) {
								return;
							}

							if (!uniqueStudents[attendanceRecord.person]) {
								uniqueStudents[attendanceRecord.person.id] = {
									name: attendanceRecord.person['first_name'] + ' ' + attendanceRecord.person['last_name']
									programs: {},
								};

								uniqueStudents[attendanceRecord.person.id].programs[attendanceRecord.program.id] {
									name: attendanceRecord.program.name,
									minDate:  moment(attendanceRecord.date, 'YYYY-MM-DD').toDate(),
									maxDate:  moment(attendanceRecord.date, 'YYYY-MM-DD').toDate()
								}
							} else {
								var student = uniqueStudents[attendanceRecord.person.id],
									program = student.programs[attendanceRecord.program.id];

								var date = moment(attendanceRecord.date, 'YYYY-MM-DD').toDate();

								if (program.minDate && date.getTime() < student.minDate.getTime()) {
									program.minDate = date;
								} else if (program.maxDate && date.getTime() > program.maxDate.getTime()) {
									program.maxDate = date;
								}
							}
						});

						var studentRequests = [];
						angular.forEach(uniqueStudents, function(record, studentId) {
							studentRequests.push($http.get(apiHost + '/api/persons/' + studentId + '/'));
						});

						$q.all(studentRequests).then(function success(responses) {
							responses.forEach(function(responseObj) {
								uniqueStudents[responseObj.data.id].firstName = responseObj.data['first_name'];
								uniqueStudents[responseObj.data.id].lastName = responseObj.data['last_name'];
							});

							resolve(uniqueStudents);
						}, function failure(errors) {
							reject(errors);
						});
					}, function failure(error) {
						reject(error);
					});
				});
			}
		};
	}

	angular.module('ttkdApp.attendanceService', ['ttkdApp.constants', 'ttkdApp.studentsService'])
		.factory('AttendanceSvc', ['$http', '$q', 'apiHost', 'StudentsSvc', AttendanceService]);
})();
