(function() {

  angular.module('ttkdApp.beltsStripesCtrl', ['ttkdApp.constants', 'mp.colorPicker'])

    .controller('BeltsStripesCtrl', ['$scope', '$rootScope', '$stateParams', 'BeltsStripesService', 
        function($scope, $rootScope, $stateParams, BeltsStripesService) {
        $rootScope.showCurrentProgram = !$stateParams.hideCurrentProgram;

        $scope.belts = [];
        $scope.stripes = [];
        $scope.primaryFocused = true;
        $scope.secondaryFocused = false;
        $scope.child = true;
     
        $scope.currentBelt = {};
        $scope.currentStripe = {};
        $scope.newBelt = {};
        $scope.newStripe = {};
     
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

            newStripe.active = true;

            BeltsStripesService.addNewStripe(newStripe).then(
            function(response){
                //re-append the # back to the colors for the colorpicker
                newStripe.color = '#' + newStripe.color;

                $scope.stripes.push(newStripe);
                
                $scope.initStripe();

                $scope.getStripeList();

            }, function(error){
                console.log('failed to post stripe successfully');
            });
        };

        $scope.updateStripe = function(stripe){
            //the front end reflects the changes made to $scope.currentStripe in this function
            //to hide this, make a copy of the stripe and post that to the API
            var currentStripe = angular.copy(stripe);

            //API doesn't take the # with the colors, strip it out
            currentStripe.color = currentStripe.color.slice(1);

            BeltsStripesService.updateStripe(currentStripe).then(
                function(response){
                    //re-append the # back to the colors for the colorpicker
                    currentStripe.color = '#' + currentStripe.color;
                   
                    $scope.currentStripe = angular.copy(currentStripe);

                }, function(error){
                    console.log('failed to update stripe successfully');
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

            newBelt.active = true;

            BeltsStripesService.addNewBelt(newBelt).then(
                function(response){
                    //re-append the # back to the colors for the colorpicker
                    newBelt['primary_color'] = '#' + newBelt['primary_color'];
                    newBelt['secondary_color'] = '#' + newBelt['secondary_color'];

                    $scope.belts.push($scope.newBelt);
                   
                    $scope.initBelt();

                    $scope.getBeltList();

                }, function(error){
                    console.log('failed to post belt successfully');
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

            BeltsStripesService.updateBelt(currentBelt).then(
                function(response){
                    //re-append the # back to the colors for the colorpicker
                    currentBelt['primary_color'] = '#' + currentBelt['primary_color'];
                    currentBelt['secondary_color'] = '#' + currentBelt['secondary_color'];

                    $scope.currentBelt = currentBelt;

                }, function(error){
                    console.log('failed to update belt successfully');
                });
        };

        $scope.getStripeList();
        $scope.getBeltList();

        $scope.initBelt();
        $scope.initStripe();
    }]);

})();