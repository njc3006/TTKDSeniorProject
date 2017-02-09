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

		function getRequestParams(filterData) {
			var params = {
				program: filterData.program,
				page: filterData.page
			};

			if (filterData.studentIds) {
				if (filterData.studentIds.length > 0) {
					params['person__in'] = filterData.studentIds;
				} else {
					params['person__in'] = '[]';
				}
			}

			if (filterData.startDate && !isDateInvalid(filterData.startDate)) {
				params['date__gte'] = moment(filterData.startDate).format('YYYY-MM-DD');
			}

			if (filterData.endDate && !isDateInvalid(filterData.endDate))  {
				params['date__lte'] = moment(filterData.endDate).format('YYYY-MM-DD');
			}

			return params;
		}

		return {
			getUngroupedRecords: function(filterData) {
				return $q(function(resolve, reject) {
					var requestConfig = {
						params: getRequestParams(filterData)
					};

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
						params: getRequestParams(filterData)
					};

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
