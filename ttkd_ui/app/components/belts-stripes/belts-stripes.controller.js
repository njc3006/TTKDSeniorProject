(function() {

  angular.module('ttkdApp.beltsStripesCtrl', ['ttkdApp.constants', 'mp.colorPicker'])

    .controller('BeltsStripesCtrl', ['$scope', '$rootScope', '$stateParams', 'BeltsStripesService', 
        function($scope, $rootScope, $stateParams, BeltsStripesService) {
        $rootScope.showCurrentProgram = !$stateParams.hideCurrentProgram;

        $scope.belts = [];
        $scope.stripes = [];
        $scope.primaryFocused = true;
        $scope.secondaryFocused = false;
     
        $scope.currentBelt = {};
        $scope.currentStripe = {};
        $scope.newBelt = {};
        $scope.newStripe = {};

        $scope.statusAlert = {
            success: false,
            failure: false
        };

        $scope.showTab = {
            updateBelt: true,
            updateStripe: false,
            createBelt: false,
            createStripe: false
        };
     
        //reset the new objects to have uninitialized properties
        $scope.initStripe = function(){
            $scope.newStripe = {
                'name': '',
                'active': false,
                'color': ''
            };
        };

        $scope.initBelt = function(){
            $scope.newBelt = {
                'name': '',
                'primary_color': '',
                'secondary_color': '',
                'active': false
            };
        };

        $scope.closeSuccessAlert = function() {
            $scope.statusAlert.success = false;
        };

        $scope.closeErrorAlert = function() {
            $scope.statusAlert.failure = false;
        };

        $scope.closeAlerts = function(){
            $scope.closeSuccessAlert();
            $scope.closeErrorAlert();
        };

        //update the displayed form based on which tab is being shown
        $scope.setShownForm = function(tabName){
            angular.forEach($scope.showTab, function(value, key){
                if(tabName === key){
                    $scope.showTab[key] = true;
                } else{
                    $scope.showTab[key] = false;
                }
            });

            $scope.closeAlerts();
        };

        //boolean logic for displaying the primary or secondary color picker for belts
        $scope.updateFocus = function(type){
            if(type === 'primary'){
                $scope.primaryFocused = true;
                $scope.secondaryFocused = false;
            } else {
                $scope.primaryFocused = false;
                $scope.secondaryFocused = true;
            }
        };

        $scope.getBeltList = function(){
            BeltsStripesService.getBeltList().then(
                function(response){
                    //the db stores colors as '001122', the front end needs them as '#001122'
                    angular.forEach(response.data, function(value){
                        value['primary_color'] = '#' + value['primary_color'];
                        value['secondary_color'] = '#' + value['secondary_color'];
                        value['display_name'] = value['name'];
                    });

                    $scope.belts = response.data;

                    if($scope.belts.length > 0){
                        $scope.currentBelt = $scope.belts[0];
                    }
                });
        };

        $scope.getStripeList = function(){
            BeltsStripesService.getStripeList().then(
                function(response){
                    //the db stores colors as '001122', the front end needs them as '#001122'
                    angular.forEach(response.data, function(value){
                        value.color = '#' + value.color;
                        value['display_name'] = value['name'];
                    });

                    $scope.stripes = response.data;

                    if($scope.stripes.length > 0){
                        $scope.currentStripe = $scope.stripes[0];
                    }
                });
        };

        $scope.createStripe = function(){
            //the front end reflects the changes made to $scope.newStripe in this function
            //to hide this, make a copy of the stripe and post that to the API
            var newStripe = angular.copy($scope.newStripe);

            //API doesn't take the # with the colors, strip it out
            newStripe.color = newStripe.color.slice(1);

            //Display name is only for UI purposes, remove it before posting
            delete newStripe['display_name'];

            newStripe.active = true;

            $scope.closeAlerts();

            BeltsStripesService.addNewStripe(newStripe).then(
            function(response){
                //re-append the # back to the colors for the colorpicker
                newStripe.color = '#' + newStripe.color;

                $scope.statusAlert.success = true;

                $scope.stripes.push(newStripe);
                $scope.initStripe();
                $scope.getStripeList();

            }, function(error){
                $scope.statusAlert.failure = true;
            });
        };

        $scope.updateStripe = function(stripe){
            //the front end reflects the changes made to $scope.currentStripe in this function
            //to hide this, make a copy of the stripe and post that to the API
            var currentStripe = angular.copy(stripe);

            //API doesn't take the # with the colors, strip it out
            currentStripe.color = currentStripe.color.slice(1);

            //Display name is only for UI purposes, remove it before posting
            delete currentStripe['display_name'];

            $scope.closeAlerts();

            BeltsStripesService.updateStripe(currentStripe).then(
                function(response){
                    //re-append the # back to the colors for the colorpicker
                    currentStripe.color = '#' + currentStripe.color;

                    $scope.currentStripe['display_name'] = currentStripe['name'];

                    $scope.statusAlert.success = true;

                }, function(error){
                    $scope.statusAlert.failure = true;
                });
        };

        $scope.createBelt = function(){
            //the front end reflects the changes made to $scope.newBelt in this function
            //to hide this, make a copy of the belt and post that to the API
            var newBelt = angular.copy($scope.newBelt);

            //API doesn't take the # with the colors, strip it out
            newBelt['primary_color'] = newBelt['primary_color'].slice(1);

            if(newBelt['secondary_color'] !== ''){
                newBelt['secondary_color'] = newBelt['secondary_color'].slice(1);    
            } else {
                //default to using the primary color if no secondary color is provided
                newBelt['secondary_color'] = newBelt['primary_color'];
            }

            //Display name is only for UI purposes, remove it before posting
            delete newBelt['display_name'];

            newBelt.active = true;

            $scope.closeAlerts();

            BeltsStripesService.addNewBelt(newBelt).then(
                function(response){
                    //re-append the # back to the colors for the colorpicker
                    newBelt['primary_color'] = '#' + newBelt['primary_color'];
                    newBelt['secondary_color'] = '#' + newBelt['secondary_color'];

                    $scope.statusAlert.success = true;

                    $scope.belts.push($scope.newBelt);
                    $scope.initBelt();
                    $scope.getBeltList();

                }, function(error){
                    $scope.statusAlert.failure = true;
                });
        };

        $scope.updateBelt = function(belt){
            //the front end reflects the changes made to $scope.currentBelt in this function
            //to hide this, make a copy of the belt and post that to the API
            var currentBelt = angular.copy(belt);

            //API doesn't take the # with the colors, strip it out
            currentBelt['primary_color'] = currentBelt['primary_color'].slice(1);

            if(currentBelt['secondary_color'] !== ''){
                currentBelt['secondary_color'] = currentBelt['secondary_color'].slice(1);                    
            } else {
                //default to using the primary color if no secondary color is provided
                currentBelt['secondary_color'] = currentBelt['primary_color'];
            }

            //Display name is only for UI purposes, remove it before posting
            delete currentBelt['display_name'];

            $scope.closeAlerts();

            BeltsStripesService.updateBelt(currentBelt).then(
                function(response){
                    //re-append the # back to the colors for the colorpicker
                    currentBelt['primary_color'] = '#' + currentBelt['primary_color'];
                    currentBelt['secondary_color'] = '#' + currentBelt['secondary_color'];

                    $scope.currentBelt['display_name'] = currentBelt['name'];

                    $scope.statusAlert.success = true;

                }, function(error){
                    $scope.statusAlert.failure = true;
                });
        };

        $scope.getStripeList();
        $scope.getBeltList();

        $scope.initBelt();
        $scope.initStripe();
    }]);

})();