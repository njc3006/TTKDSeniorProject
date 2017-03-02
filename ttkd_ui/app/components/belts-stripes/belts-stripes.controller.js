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
        $scope.currentId = '';
        $scope.newBelt = {};
        $scope.newStripe = {};

        $scope.statusAlert = {
            success: false,
            failure: false,
            color: false
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

        $scope.closeAlert = function(alert){
            $scope.statusAlert[alert] = false;
        };

        $scope.closeAlerts = function(){
            $scope.closeAlert('success');
            $scope.closeAlert('error');
            $scope.closeAlert('color');
        };

        $scope.validateColor = function(color){
            var hexColor = new RegExp('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$');
           
            var result = hexColor.test(color);
            if(result === false){
                $scope.closeAlerts();
                $scope.statusAlert.color = true;
            }
           
            return result;
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

        $scope.previewStyle = function(currentBelt){
            var primaryStyle, secondaryStyle = '';

            if(currentBelt['primary_color']){
                primaryStyle = currentBelt['primary_color'].toLowerCase() === '#ffffff' ?
                    'black 8px double' : currentBelt['primary_color'] + ' 8px solid';
            } 

            if(currentBelt['secondary_color']){
                 secondaryStyle = currentBelt['secondary_color'].toLowerCase() === '#ffffff' ?
                    'black 8px double' : currentBelt['secondary_color'] + ' 8px solid';
            } else if(currentBelt['primary_color']){
                secondaryStyle = primaryStyle;
            }

            return {
                'border-right': secondaryStyle,
                'border-left': primaryStyle,
                'border-top': primaryStyle,
                'border-bottom': secondaryStyle
            };
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

                    if($scope.belts.length > 0 && $scope.currentId === ''){
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

            //validate stripe color
            if(!$scope.validateColor(newStripe.color)){
                return;
            }

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

            //validate stripe color
            if(!$scope.validateColor(currentStripe.color)){
                return;
            }

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

                    $scope.getStripeList();

                }, function(error){
                    $scope.statusAlert.failure = true;
                });
        };

        $scope.createBelt = function(){
            //the front end reflects the changes made to $scope.newBelt in this function
            //to hide this, make a copy of the belt and post that to the API
            var newBelt = angular.copy($scope.newBelt);

            //validate belt color
            if(!$scope.validateColor(newBelt['primary_color'])){
                return;
            }

            //API doesn't take the # with the colors, strip it out
            newBelt['primary_color'] = newBelt['primary_color'].slice(1);

            if(newBelt['secondary_color'] !== ''){
                if(!$scope.validateColor(newBelt['secondary_color'])){
                    return;
                }

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

            //validate belt color
            if(!$scope.validateColor(currentBelt['primary_color'])){
                return;
            }

            //API doesn't take the # with the colors, strip it out
            currentBelt['primary_color'] = currentBelt['primary_color'].slice(1);

            if(currentBelt['secondary_color'] !== ''){
                if(!$scope.validateColor(currentBelt['secondary_color'])){
                    return;
                }

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
                    $scope.currentId = currentBelt.id;

                    $scope.getBeltList();

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