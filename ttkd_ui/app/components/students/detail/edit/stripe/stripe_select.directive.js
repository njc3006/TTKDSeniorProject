(function() {
	function StripeSelectController($scope, $http, apiHost) {
		var controller = this;

		controller.selectedFromAllStripes = [];
		controller.selectedFromStudentStripes = [];

		controller.onAllStripeClick = function(index) {
			var selectedStripe = controller.allStripes[index];

			selectedStripe.active = !selectedStripe.active;

			if (selectedStripe.active) {
				controller.selectedFromAllStripes.push(controller.allStripes[index]);
			} else {
				controller.selectedFromAllStripes = controller.selectedFromAllStripes.filter(function(stripe) {
					return stripe.id !== selectedStripe.id;
				});
			}
		};

		controller.onStudentStripeClick = function(index) {
			var selectedStripe = controller.studentStripes[index];

			selectedStripe.active = !selectedStripe.active;

			if (selectedStripe.active) {
				controller.selectedFromStudentStripes.push(index);
			} else {
				controller.selectedFromStudentStripes = controller.selectedFromStudentStripes.filter(function(idx) {
					return idx !== index;
				});
			}
		};

		controller.addSelectedStripesToStudent = function() {
			controller.studentStripes = controller.studentStripes.concat(controller.selectedFromAllStripes.map(function(stripe) {
				var newStripe = {};
				angular.copy(stripe, newStripe);
				newStripe.active = false;
				return newStripe;
			}));

			controller.selectedFromAllStripes = [];
			controller.allStripes.forEach(function(stripe) {
				stripe.active = false;
			});
		};

		controller.removeSelectedStripesFromStudent = function() {
			controller.selectedFromStudentStripes.sort();
			for (var i = controller.selectedFromStudentStripes.length - 1; i > -1; i--) {
				controller.studentStripes.splice(controller.selectedFromStudentStripes[i], 1);
			}

			controller.selectedFromStudentStripes = [];
		};

		$http.get(apiHost + '/api/stripes/').then(
			function success(response) {
				controller.allStripes = response.data.map(function(stripe) {
					stripe.active = false;
					return stripe;
				});
			},
			function failure(error) {
				//$scope.requestFlags.loading.failure = true;
			}
		);
	}

	angular.module('ttkdApp.editStudentCtrl')
		.directive('stripeSelect', function() {
			return {
				restrict: 'E',
				scope: {},
				templateUrl: 'components/students/detail/edit/stripe/stripe_select.directive.html',
				controller: ['$scope', '$http', 'apiHost', StripeSelectController],
				bindToController: {
					studentStripes: '='
				},
				controllerAs: 'ctrl'
			};
		});
})();
