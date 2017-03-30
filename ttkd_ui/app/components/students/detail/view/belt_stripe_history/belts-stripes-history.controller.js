(function() {
	function BeltsStripesHistoryController($scope, SharedDataService, StudentsService) {
		function compareDatesInverse(a, b) {
			var dateA = moment(a['date_achieved'], 'YYYY-MM-DD').toDate(),
				dateB = moment(b['date_achieved'], 'YYYY-MM-DD').toDate();

			return dateB.getTime() - dateA.getTime();
		}

		function formatDate(date) {
			return moment(date).format('MM/DD/YYYY');
		}

		$scope.makeHistoryText = function(record) {
			var text = record.name;

			if (record.type === 'stripe') {
				text += ' Stripe Achieved ';
			} else {
				text += ' Belt Achieved ';
			}

			text += formatDate(record.date);

			return text;
		};

		$scope.getRecordStyle = function(record) {
			return record.type === 'belt' ? 'belt-achieve-row' : '';
		};

		SharedDataService.getActiveStudent().then(function(student) {
			$scope.loadingInProgress = true;
			$scope.loadingFailed = false;

			StudentsService.getBeltHistoryForStudent(student.id).then(
				function success(response) {
					$scope.history = response.data.map(function(personBelt) {
						return {
							type: 'belt',
							date: moment(personBelt['date_achieved'], 'YYYY-MM-DD').toDate(),
							name: personBelt.belt.name
						};
					});

					StudentsService.getStripeHistoryForStudent(student.id).then(
						function success(response) {
							$scope.history = $scope.history.concat(response.data.map(function(personStripe) {
								return {
									type: 'stripe',
									date: moment(personStripe['date_achieved'], 'YYYY-MM-DD').toDate(),
									name: personStripe.stripe.name
								};
							}));

							$scope.history = $scope.history.sort(function(a, b) {
								var momentA = moment(a.date),
									momentB = moment(b.date);

								if (momentB.isSame(momentA, 'day') && b.type === 'belt') {
									return 1;
								} else if (momentB.isSame(momentA, 'day') && b.type === 'stripe') {
									return -1;
								}

								return b.date.getTime() - a.date.getTime();
							});

							$scope.loadingInProgress = false;
						},
						function failure(error) {
							console.error(error);
							$scope.loadingFailed = true;
							$scope.loadingInProgress = false;
						}
					);
				},
				function failure(error) {
					console.error(error);
					$scope.loadingInProgress = false;
					$scope.loadingFailed = true;
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
