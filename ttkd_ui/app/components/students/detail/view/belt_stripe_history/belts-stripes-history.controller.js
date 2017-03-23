(function() {
	function BeltsStripesHistoryController($scope, SharedDataService, StudentsService) {
		function compareDatesInverse(a, b) {
			var dateA = moment(a['date_achieved'], 'YYYY-MM-DD').toDate(),
				dateB = moment(b['date_achieved'], 'YYYY-MM-DD').toDate();

			return dateB.getTime() - dateA.getTime();
		}

		$scope.formatDate = function(date) {
			return moment(date, 'YYYY-MM-DD').format('MM/DD/YYYY');
		}

		SharedDataService.getActiveStudent().then(function(student) {
			$scope.loadingBeltHistory = true;
			$scope.loadingStripeHistory = true;

			StudentsService.getBeltHistoryForStudent(student.id).then(
				function success(response) {
					$scope.beltHistory = response.data.sort(compareDatesInverse);
					$scope.loadingBeltHistory = false;
				},
				function failure(error) {
					console.error(error);
					$scope.loadingBeltHistoryFailed = true
					$scope.loadingBeltHistory = false;
				}
			);

			StudentsService.getStripeHistoryForStudent(student.id).then(
				function success(response) {
					$scope.stripeHistory = response.data.sort(compareDatesInverse);
					$scope.loadingStripeHistory = false;
				},
				function failure(error) {
					console.error(error);
					$scope.loadingStripeHistoryFailed = true
					$scope.loadingStripeHistory = false;
				}
			);
		});
	}

	angular.module('ttkdApp.studentDetailCtrl')
		.controller('BeltsStripesHistoryCtrl', [
			'$scope',
			'SharedDataSvc',
			'StudentsSvc',
			BeltsStripesHistoryController
		]);
})();
