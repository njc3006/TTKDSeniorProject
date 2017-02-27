(function() {
	/*
	 * This service exists to transfer student id from the parent student detail controller to a child controller
	 */
	function SharedDataService() {
		var studentId = 0;
		var studentDob = null;

		return {
			setStudentId: function(id) {
				studentId = id;
			},
			getStudentId: function() {
				return studentId;
			},
			setStudentDob: function(dob) {
				studentDob = dob;
			},
			getStudentDob: function() {
				return studentDob;
			}
		};
	}

	angular.module('ttkdApp.studentDetailCtrl')
		.service('SharedDataSvc', [SharedDataService]);
})();
