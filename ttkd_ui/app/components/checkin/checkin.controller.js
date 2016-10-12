(function() {

  angular.module('ttkdApp.checkinCtrl', [])

    .controller('CheckinCtrl', ['$scope', '$document', '$uibModal', function($scope, $document, $uibModal) {
				var modalInstance;

        $scope.people = [];
        for (var i = 0; i < 30; i++) {
            $scope.people.push(
                {
                    name: 'Person ' + i,
                    picture: 'http://placehold.it/350x350'
                }
            );
        }

        /*
         * Open a prompt to confirm checkin for a person.
         */
        $scope.openCheckinPrompt = function(person) {
					var modalElement = angular.element($document[0].querySelector('#checkin-modal'));

					modalInstance = $uibModal.open({
						animation: true,
						ariaLabelledBy: 'modal-title',
			      ariaDescribedBy: 'modal-body',
			      templateUrl: 'components/checkin/checkin.modal.html',
						scope: $scope
					});

					modalInstance.result.then(function (selectedItem) {
			      //$ctrl.selected = selectedItem;
			    }, function () {
			      console.log('Modal dismissed at: ' + new Date());
			    });
        };

				$scope.ok = function() {};

				$scope.cancel = function() {
					modalInstance.dismiss('cancel');
				};
    }]);

})();
