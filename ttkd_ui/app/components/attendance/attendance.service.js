(function() {
	function AttendanceService($http, $q, apiHost, StudentsService) {
		function isDateInvalid(date) {
			if (Object.prototype.toString.call(date) === '[object Date]') {
			  // it is a date
			  if (isNaN(date.getTime())) {  // d.valueOf() could also work
			    // date is not valid
					return true;
			  }
			  else {
			    // date is valid
					return false;
			  }
			}

			return true;
		}

		return {
			getUngroupedRecords: function(filterData) {
				return $q(function(resolve, reject) {
					var requestConfig = {
						params: {
							person: filterData.studentId,
							program: filterData.program,
							page: filterData.page
						}
					};

					if (filterData.startDate !== undefined && !isDateInvalid(filterData.startDate)) {
						requestConfig.params['date__gte'] = moment(filterData.startDate).format('YYYY-MM-DD');
					}

					if (filterData.endDate !== undefined && !isDateInvalid(filterData.endDate))  {
						requestConfig.params['date__lte'] = moment(filterData.endDate).format('YYYY-MM-DD');
					}

					/*var firstName, lastName;
					if (filterData.student) {
						var splitName = filterData.student.split(' ');
						firstName = splitName[0];
						lastName = splitName[1];
					}*/

					$http.get(apiHost + '/api/check-ins-detailed/', requestConfig).then(function success(response) {
						resolve(response.data);
					}, function failure(error) {
						reject(error);
					});
				});
			},

			getGroupedByStudentRecords: function(filterData) {
				return $q(function(resolve, reject) {
					var requestConfig = {
						params: {
							person: filterData.studentId,
							program: filterData.program,
							page: filterData.page
						}
					};

					if (filterData.startDate !== undefined) {
						requestConfig.params['date__gte'] = moment(filterData.startDate).format('YYYY-MM-DD');
					}

					if (filterData.endDate !== undefined)  {
						requestConfig.params['date__lte'] = moment(filterData.endDate).format('YYYY-MM-DD');
					}

					var firstName, lastName;
					if (filterData.student) {
						var splitName = filterData.student.split(' ');
						firstName = splitName[0];
						lastName = splitName[1];
					}

					$http.get(apiHost + '/api/check-ins-detailed/', requestConfig).then(function success(response) {
						var groupedRecords = {};

						response.data.results = response.data.results.filter(function(attendanceRecord) {
							if (firstName) {
								if (attendanceRecord.person['first_name'].indexOf(firstName) === -1) {
									return false;
								}
							} else if (firstName && lastName) {
								if (attendanceRecord.person['first_name'].indexOf(firstName) === -1) {
									if (attendanceRecord.person['last_name'].indexOf(lastName) === -1) {
										return false;
									}
								}
							}

							return true;
						});

						response.data.results.forEach(function(attendanceRecord) {
							if (firstName) {
								if (attendanceRecord.person['first_name'].indexOf(firstName) === -1) {
									return;
								}
							} else if (firstName && lastName) {
								if (attendanceRecord.person['first_name'].indexOf(firstName) === -1) {
									if (attendanceRecord.person['last_name'].indexOf(lastName) === -1) {
										return;
									}
								}
							}

							if (groupedRecords[attendanceRecord.person.id] === undefined) {
								groupedRecords[attendanceRecord.person.id] = {
									name: attendanceRecord.person['first_name'] + ' ' + attendanceRecord.person['last_name'],
									programs: {},
								};

								groupedRecords[attendanceRecord.person.id].programs[attendanceRecord.program.id] = {
									name: attendanceRecord.program.name,
									minDate:  moment(attendanceRecord.date, 'YYYY-MM-DD').toDate(),
									maxDate:  moment(attendanceRecord.date, 'YYYY-MM-DD').toDate(),
									count: 1
								};
							} else {
								var student = groupedRecords[attendanceRecord.person.id];

								if (student.programs[attendanceRecord.program.id] !== undefined) {
									var program = student.programs[attendanceRecord.program.id];

									var date = moment(attendanceRecord.date, 'YYYY-MM-DD').toDate();

									if (program.minDate && date.getTime() < program.minDate.getTime()) {
										program.minDate = date;
									} else if (program.maxDate && date.getTime() > program.maxDate.getTime()) {
										program.maxDate = date;
									}

									program.count++;
								} else {
									student.programs[attendanceRecord.program.id] = {
										name: attendanceRecord.program.name,
										minDate: moment(attendanceRecord.date, 'YYYY-MM-DD').toDate(),
										maxDate: moment(attendanceRecord.date, 'YYYY-MM-DD').toDate(),
										count: 1
									};
								}
							}
						});

						response.data.results = groupedRecords;

						resolve(response.data);
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
