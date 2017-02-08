(function() {

  angular.module('ttkdApp.checkinCtrl', ['ttkdApp.constants'])

    .controller('CheckinCtrl', ['$scope', '$rootScope', '$stateParams', '$document', 
    	'$filter', '$uibModal', 'CheckinService', 'apiHost',
		function($scope, $rootScope, $stateParams, $document, $filter, $uibModal, CheckinService, apiHost) {
		var modalInstance;
		$rootScope.showCurrentProgram = !$stateParams.hideCurrentProgram;

		$scope.apiHost = apiHost;
		$scope.programID = $stateParams.programID;
		$scope.instructor = $stateParams.instructor;
		$scope.date = new Date();
		$scope.checkedInPeople = [];
		$scope.people = [];
		$scope.checkedInPeopleIds = [];
		$scope.checkedInPeopleCheckinIds = [];

		$scope.selectedDate = {
            open: false,
            value: $scope.date
        };

        //opens the popup date picker window
        $scope.open = function(){
            $scope.selectedDate.open = true;
        };

        //sets the date picker date to today
        $scope.today = function(){
            $scope.selectedDate.value = new Date();
        };

        $scope.updateCheckins = function(){
			$scope.date = $scope.selectedDate.value;
            $scope.checkedInPeople = [];
			$scope.people = [];
			$scope.checkedInPeopleIds = [];
			$scope.checkedInPeopleCheckinIds = [];
			$scope.getCheckinsForClass();
        	$scope.getStudents();
        };

        $scope.formatDate = function(date){
			return $filter('date')(date, 'yyyy-MM-dd');
		};

		$scope.getBeltStyle = function(belt) {
            var primaryStyle = belt['primary_color'].toLowerCase() === 'ffffff' ?
                'black 8px double' :
                '#' + belt['primary_color'] + ' 8px solid';

                var secondaryStyle = belt['secondary_color'].toLowerCase() === 'ffffff' ?
                    'black 8px double' :
                    '#' + belt['secondary_color'] + ' 8px solid';

            return {
                'border-right': secondaryStyle,
                'border-left': primaryStyle,
                'border-top': primaryStyle,
                'border-bottom': secondaryStyle
            };
        };

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
        $scope.getCheckinsForClass = function(){
		CheckinService.getCheckinsForClass($scope.programID, $scope.formatDate($scope.date)).then(
			function(response){
				 var tempdata = response.data;

				//we need a uniform structure for both the students and persons
				//to do so we take the information in the "person" property of the student
				// object and put it directly into the student object to match the structure
				// of the person object
				angular.forEach(tempdata, function(value, key){
					$scope.checkedInPeopleIds.push(value['person']);
					$scope.checkedInPeopleCheckinIds.push(value['id']);
				});

			});
        };

        // Get all of the students from the class and then move the ones that are already
		// checked in into a separate list
		$scope.getStudents = function(){
		CheckinService.getStudentsFromClass($stateParams.programID).then(
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

					value.beltStyle = $scope.getBeltStyle(value.belt);
				});

				//add a placeholder image to each person
				var tempPeople = $scope.transformData(tempdata);

				//Move the people that are already checked in into a separate list
				angular.forEach(tempPeople, function(value){
					var personID = value['id'];
					var index = $scope.checkedInPeopleIds.indexOf(personID);
					if (index !== -1){
						value.checkinID = $scope.checkedInPeopleCheckinIds[index];
						$scope.checkedInPeople.push(value);
					}else{
						$scope.people.push(value);
					}

				});
			});
        };

        // Load the data for the page, must be called in this order
		$scope.getCheckinsForClass();
        $scope.getStudents();

        /*
         * Open a prompt to confirm checkin for a person.
         */
        $scope.openCheckinPrompt = function(person) {
			var modalElement = angular.element($document[0].querySelector('#checkin-modal'));

			$scope.selectedPerson = person;

			modalInstance = $uibModal.open({
				animation: true,
				windowClass: 'checkin-modal',
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
			// create checkin using api, backend will auto set the date to today
			CheckinService.createCheckin({'person': $scope.selectedPerson.id, 'program': $scope.programID}).then(
				function(response){
				$scope.selectedPerson.checkinID = response.data.id;
				});
			modalInstance.dismiss('yes');

			//pop person from the list and move them to the end
			$scope.people.splice($scope.people.indexOf($scope.selectedPerson),1);
			$scope.checkedInPeople.push($scope.selectedPerson);
		};

		$scope.instructClickCheckin = function(person) {
			// create checkin using api using the selected date
			CheckinService.createCheckin(
				{
					'person': person.id, 
					'program': $scope.programID, 
					'date': $scope.formatDate($scope.date)
				}).then(
				function(response){
				person.checkinID = response.data.id;
				});

			//pop person from the list and move them to the end
			$scope.people.splice($scope.people.indexOf(person),1);
			$scope.checkedInPeople.push(person);
		};

		$scope.instructClickDeleteCheckin = function(person) {
			// delete checkin using api

			CheckinService.deleteCheckin(person.checkinID);

			person.checkinID = null;

			//pop person from the checked in list and move them to people
			$scope.checkedInPeople.splice($scope.checkedInPeople.indexOf(person),1);
			$scope.people.push(person);
		};

		$scope.no = function() {
			modalInstance.dismiss('no');
		};
    }]);

})();
