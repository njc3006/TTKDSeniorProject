(function() {
	function StripeSelectController($scope, $http, apiHost) {
		$scope.selectedFromAllStripes = [];
		$scope.selectedFromStudentStripes = [];

		$scope.studentStripes = [];

		$scope.onAllStripeClick = function(index) {
			var selectedStripe = $scope.allStripes[index];

			selectedStripe.active = !selectedStripe.active;

			if (selectedStripe.active) {
				$scope.selectedFromAllStripes.push($scope.allStripes[index]);
			} else {
				$scope.selectedFromAllStripes = $scope.selectedFromAllStripes.filter(function(stripe) {
					return stripe.id !== selectedStripe.id;
				});
			}
		};

		$scope.onStudentStripeClick = function(index) {
			var selectedStripe = $scope.studentStripes[index];

			selectedStripe.active = !selectedStripe.active;

			if (selectedStripe.active) {
				$scope.selectedFromStudentStripes.push(index);
			} else {
				$scope.selectedFromStudentStripes = $scope.selectedFromStudentStripes.filter(function(idx) {
					return idx !== index;
				});
			}
		};

		$scope.addSelectedStripesToStudent = function() {
			$scope.studentStripes = $scope.studentStripes.concat($scope.selectedFromAllStripes.map(function(stripe) {
				var newStripe = {};
				angular.copy(stripe, newStripe);
				newStripe.active = false;
				return newStripe;
			}));

			$scope.selectedFromAllStripes = [];
			$scope.allStripes.forEach(function(stripe) {
				stripe.active = false;
			});
		};

		$scope.removeSelectedStripesFromStudent = function() {
			$scope.selectedFromStudentStripes.sort();
			for (var i = $scope.selectedFromStudentStripes.length - 1; i > -1; i--) {
				$scope.studentStripes.splice($scope.selectedFromStudentStripes[i], 1);
			}

			$scope.selectedFromStudentStripes = [];
		}

		$http.get(apiHost + '/api/stripes/').then(
			function success(response) {
				$scope.allStripes = response.data.map(function(stripe) {
					stripe.active = false;
					return stripe;
				});
			},
			function failure(error) {

			}
		);
	}

	angular.module('ttkdApp.editStudentCtrl')
		.directive('stripeSelect', function() {
			return {
				restrict: 'E',
				require: 'ngModel',
				templateUrl: 'components/students/detail/edit/stripes/stripes.directive.html',
				scope: {
					ngModel: '=',
				},
				controller: ['$scope', '$http', 'apiHost', StripeSelectController]
			};
		});
})();
