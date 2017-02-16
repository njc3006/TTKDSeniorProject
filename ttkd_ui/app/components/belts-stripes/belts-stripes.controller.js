(function() {

  angular.module('ttkdApp.beltsStripesCtrl', ['ttkdApp.constants', 'mp.colorPicker'])

    .controller('BeltsStripesCtrl', ['$scope', '$rootScope', '$stateParams', 'BeltsStripesService', 
        function($scope, $rootScope, $stateParams, BeltsStripesService) {
        $rootScope.showCurrentProgram = !$stateParams.hideCurrentProgram;

        $scope.belts = [];
        $scope.stripes = [];
        $scope.active = false;
        $scope.status = ''; //this needs to be refactored
        $scope.primaryFocused = true;
        $scope.secondaryFocused = false;
        $scope.currentStripe = {};
        $scope.currentBelt = {};

        //returns a blank object of the specific type with uninitialized properties
        $scope.initStripe = function(type){
            $scope.currentStripe = {
                'name': '',
                'active': false,
                'color': ''
            };
        };

        $scope.initBelt = function(){
            $scope.currentBelt = {
                 'name': '',
                'primary_color': '',
                'secondary_color': '',
                'active': false
            };
        };

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
                        value.primary_color = '#' + value.primary_color;
                        value.secondary_color = '#' + value.secondary_color;
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

        $scope.save = function(type){
    		if(type === 'belt'){
                //API doesn't take the # with the colors, strip it out
                $scope.currentBelt['primary_color'] = $scope.currentBelt['primary_color'].slice(1);

                if($scope.currentBelt['secondary_color'] !== ''){
                    $scope.currentBelt['secondary_color'] = 
                                                $scope.currentBelt['secondary_color'].slice(1);                    
                } else {
                    //default to using the primary color if no secondary color is provided
                    $scope.currentBelt['secondary_color'] = $scope.currentBelt['primary_color'];
                }

                if($scope.status === 'new'){
                    $scope.currentBelt.active = true;

                    BeltsStripesService.addNewBelt($scope.currentBelt).then(
                        function(response){
                            //re-append the # back to the colors for the colorpicker
                            $scope.currentBelt['primary_color'] = '#' + $scope.currentBelt['primary_color'];
                            $scope.currentBelt['secondary_color'] = '#' + $scope.currentBelt['secondary_color'];

                            $scope.belts.push($scope.currentBelt);
                            $scope.initBelt();

                        }, function(error){
                            console.log('failed to post belt successfully');
                        });
                } else {
                    BeltsStripesService.updateBelt($scope.currentBelt).then(
                        function(response){
                            //re-append the # back to the colors for the colorpicker
                            $scope.currentBelt['primary_color'] = '#' + $scope.currentBelt['primary_color'];
                            $scope.currentBelt['secondary_color'] = '#' + $scope.currentBelt['secondary_color'];

                            $scope.initBelt();
                        }, function(error){
                            console.log('failed to update belt successfully');
                        });
                }
    		} else {
                //API doesn't take the # with the colors, strip it out
                $scope.currentStripe.color = $scope.currentStripe.color.slice(1);

                if($scope.status === 'new'){
                    $scope.currentStripe.active = true;

                    BeltsStripesService.addNewStripe($scope.currentStripe).then(
                        function(response){
                            //re-append the # back to the colors for the colorpicker
                            $scope.currentStripe.color = '#' + $scope.currentStripe.color;

                            $scope.stripes.push($scope.currentStripe);
                            $scope.initStripe('stripe');

                        }, function(error){
                            console.log('failed to post stripe successfully');
                        });
                } else {
                    BeltsStripesService.updateStripe($scope.currentStripe).then(

                        function(response){
                            //re-append the # back to the colors for the colorpicker
                            $scope.currentStripe.color = '#' + $scope.currentStripe.color;

                            $scope.initStripe('stripe');

                        }, function(error){
                            console.log('failed to update stripe successfully');
                        });
                }
    		}
        };

        $scope.getStripeList();
        $scope.getBeltList();

    }]);

})();