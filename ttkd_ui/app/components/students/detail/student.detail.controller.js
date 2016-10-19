(function() {
	function StudentDetailController($scope, $stateParams, StudentsService) {
		//TODO: uncomment when api call is implemented
		/*StudentsService.getStudent($stateParams.studentId).then(function(response) {

		}, function(error) {

		});*/
	}

	angular.module('ttkdApp.studentDetailController', ['ttkdApp.studentsService'])
		.controller('StudentDetailCtrl', [
			'$scope',
			'$stateParams',
			'StudentsSvc'
			StudentDetailController
		]);
})();
