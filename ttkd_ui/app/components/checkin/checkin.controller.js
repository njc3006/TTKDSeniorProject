(function() {

  angular.module('ttkdApp.checkinCtrl', [])

    .controller('CheckinCtrl', ['$scope', '$document', '$uibModal', 'CheckinService',
		function($scope, $document, $uibModal, CheckinService) {
				var modalInstance;

		//Hard coded for now until a program is accessible by this controller
		$scope.programID = 1;
		$scope.checkedInPeople = [];
		$scope.people = [];
		$scope.checkedInPeopleIds = [];

		//transforms the data to include a temp picture property
        $scope.transformData = function(data){
            var tempdata = data;
            //Until we have picture working this is the default picture for testing/layout
            angular.forEach(tempdata, function(value){
                value.picture = 'http://placehold.it/350x350';
            });

            return tempdata;
        };

        // Get who is currently checked into the class
        $scope.getCurrentCheckinsForClass = function(){
		CheckinService.getCurrentCheckinsForClass($scope.programID).then(
			function(response){
				 var tempdata = response.data;

				//we need a uniform structure for both the students and persons
				//to do so we take the information in the "person" property of the student
				// object and put it directly into the student object to match the structure
				// of the person object
				angular.forEach(tempdata, function(value, key){
					$scope.checkedInPeopleIds.push(value['person']);
				});

			});
        };

        // Get all of the students from the class and then move the ones that are already
		// checked in into a separate list
		$scope.getStudents = function(){
		CheckinService.getStudentsFromClass($scope.programID).then(
			function(response){
				 var tempdata = response.data;

				//we need a uniform structure for both the students and persons
				//to do so we take the information in the "person" property of the student
				// object and put it directly into the student object to match the structure
				// of the person object
				angular.forEach(tempdata, function(value, key){
					angular.forEach(value['person'], function(v2, k2){
						value[k2] = v2;
						delete value['person'];
					});
				});

				var tempPeople = $scope.transformData(tempdata);
				//Move the people that are already checked in into a separate list
				angular.forEach(tempPeople, function(value){
					var personID = value['id'];
					if ($scope.checkedInPeopleIds.indexOf(personID) !== -1){
						$scope.checkedInPeople.push(value);
					}else{
						$scope.people.push(value);
					}

				});
			});
        };

        // Load the data for the page, must be called in this order
		$scope.getCurrentCheckinsForClass();
        $scope.getStudents();

        /*
         * Open a prompt to confirm checkin for a person.
         */
        $scope.openCheckinPrompt = function(person) {
			var modalElement = angular.element($document[0].querySelector('#checkin-modal'));

			$scope.selectedPerson = person;

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
			});
        };

		$scope.yes = function() {
			// create checkin using api
			CheckinService.createCheckin({'person': $scope.selectedPerson.id,
										  'program': $scope.programID});
			modalInstance.dismiss('yes');

			//pop person from the list and move them to the end
			$scope.people.splice($scope.people.indexOf($scope.selectedPerson),1);
			$scope.checkedInPeople.push($scope.selectedPerson);
		};

		$scope.no = function() {
			modalInstance.dismiss('no');
		};
    }]);

})();
