(function() {
	function AttendanceService($http, $q, apiHost, StudentsService) {
		return {
			getGroupedByStudentRecords: function(filterData) {
				return $q(function(resolve, reject) {
					var requestConfig = {
						params: {
							program: filterData.program,
							date: moment(filterData.startDate).format('YYYY-MM-DD')
						}
					};

					$http.get(apiHost + '/api/check-ins/', requestConfig).then(function success(response) {
						var uniqueStudents = {};

						response.data.forEach(function(attendanceRecord) {
							if (filterData.endDate && moment(attendanceRecord.date, 'YYYY-MM-DD').isAfter(filterData.endDate)) {
								return;
							}

							if (!uniqueStudents[attendanceRecord.person]) {
								uniqueStudents[attendanceRecord.person] = {
									attendanceRecords: [attendanceRecord],
									minDate: moment(attendanceRecord.date, 'YYYY-MM-DD'),
									maxDate: moment(attendanceRecord.date, 'YYYY-MM-DD')
								};
							} else {
								var student = uniqueStudents[attendanceRecord.person];

								student.attendanceRecords.push(attendanceRecord);

								var date = moment(attendanceRecord.date, 'YYYY-MM-DD');

								if (student.minDate && date < student.minDate) {
									student.minDate = date;
								} else if (student.maxDate && date > student.maxDate) {
									student.maxDate = date;
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
