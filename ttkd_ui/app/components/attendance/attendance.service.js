(function() {
	function AttendanceService($http, $q, apiHost, StudentsService) {
		return {
			getUngroupedRecords: function(filterData) {
				return $q(function(resolve, reject) {
					var requestConfig = {
						params: {
							program: filterData.program,
							'date__lte': moment(filterData.endDate).format('YYYY-MM-DD'),
							'date__gte': moment(filterData.startDate).format('YYYY-MM-DD')
						}
					};

					var firstName, lastName;
					if (filterData.student) {
						var splitName = filterData.student.split(' ');
						firstName = splitName[0];
						lastName = splitName[1];
					}

					$http.get(apiHost + '/api/check-ins-detailed/', requestConfig).then(function success(response) {
						var ungroupedRecords = [];

						response.data.forEach(function(attendanceRecord) {
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

							ungroupedRecords.push(attendanceRecord);
						});

						resolve(ungroupedRecords);
					}, function failure(error) {
						reject(error);
					});
				});
			},

			getGroupedByStudentRecords: function(filterData) {
				return $q(function(resolve, reject) {
					var requestConfig = {
						params: {
							program: filterData.program,
							'date__lte': moment(filterData.endDate).format('YYYY-MM-DD'),
							'date__gte': moment(filterData.startDate).format('YYYY-MM-DD')
						}
					};

					var firstName, lastName;
					if (filterData.student) {
						var splitName = filterData.student.split(' ');
						firstName = splitName[0];
						lastName = splitName[1];
					}

					$http.get(apiHost + '/api/check-ins-detailed/', requestConfig).then(function success(response) {
						var groupedRecords = {};

						response.data.forEach(function(attendanceRecord) {
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
									console.log('UPDATE PROGRAM');
									var program = student.programs[attendanceRecord.program.id];

									var date = moment(attendanceRecord.date, 'YYYY-MM-DD').toDate();

									if (program.minDate && date.getTime() < program.minDate.getTime()) {
										program.minDate = date;
									} else if (program.maxDate && date.getTime() > program.maxDate.getTime()) {
										program.maxDate = date;
									}

									program.count++;
								} else {
									console.log('NEW PROGRAM');
									student.programs[attendanceRecord.program.id] = {
										name: attendanceRecord.program.name,
										minDate:  moment(attendanceRecord.date, 'YYYY-MM-DD').toDate(),
										maxDate:  moment(attendanceRecord.date, 'YYYY-MM-DD').toDate(),
										count: 1
									};
								}
							}
						});

						resolve(groupedRecords);
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
