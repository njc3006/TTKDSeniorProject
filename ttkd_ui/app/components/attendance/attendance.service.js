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
							'person__in': filterData.studentIds,
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
							'person__in': filterData.studentIds,
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

					$http.get(apiHost + '/api/grouped-check-ins-detailed/', requestConfig).then(
						function success(response) {
							resolve(response.data);
						}, function failure(error) {
							reject(error);
						}
					);
				});
			}
		};
	}

	angular.module('ttkdApp.attendanceService', ['ttkdApp.constants', 'ttkdApp.studentsService'])
		.factory('AttendanceSvc', ['$http', '$q', 'apiHost', 'StudentsSvc', AttendanceService]);
})();
