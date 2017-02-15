(function() {

  angular.module('ttkdApp.beltsStripesCtrl', ['ttkdApp.constants', 'mp.colorPicker'])

    .controller('BeltsStripesCtrl', ['$scope', '$rootScope', '$stateParams', 'BeltsStripesService', 
        function($scope, $rootScope, $stateParams, BeltsStripesService) {
        $rootScope.showCurrentProgram = !$stateParams.hideCurrentProgram;

        $scope.belts = [];
        $scope.stripes = [];
        $scope.active = false;
        $scope.status = '';
        $scope.pageTitle = '';
        $scope.currentObj = {};
        $scope.hasInactive = {
            'belt' : false,
            'stripe' : false
        };

        //returns a blank object of the specific type with uninitialized properties
        $scope.initCurrent = function(type){
            if(type === 'stripe'){
                return {
                    'name': '',
                    'active': false,
                    'color': ''
                };
            } else {
                return {
                    'name': '',
                    'primary_color': '',
                    'secondary_color': '',
                    'active': false
                };
            }
        };

        $scope.getBeltList = function(){
            BeltsStripesService.getBeltList().then(
                function(response){
                     $scope.hasInactive.belt = response.data.some(function(e) { 
                        if(e.active === false){
                            return true;
                        }
                        else { return false };
                    });

                    //the db stores colors as '001122', the front end needs them as '#001122'
                    angular.forEach(response.data, function(value){
                        value.primary_color = '#' + value.primary_color;
                        value.secondary_color = '#' + value.secondary_color;

                        console.log(value);
                    });

                    $scope.belts = response.data;
                });
        };

        $scope.getStripeList = function(){
            BeltsStripesService.getStripeList().then(
                function(response){
                    $scope.hasInactive.stripe = response.data.some(function(e) { 
                        if(e.active === false){
                            return true;
                        }
                        else { return false };
                    });

                    //the db stores colors as '001122', the front end needs them as '#001122'
                    angular.forEach(response.data, function(value){
                        value.color = '#' + value.color;
                    });

                    $scope.stripes = response.data;
                });
        };

        $scope.save = function(type){
    		if(type === 'belt'){
                //API doesn't take the # with the colors, strip it out
                $scope.currentObj['primary_color'] = $scope.currentObj['primary_color'].slice(1);

                if($scope.currentObj['secondary_color'] !== ''){
                    $scope.currentObj['secondary_color'] = 
                                                $scope.currentObj['secondary_color'].slice(1);                    
                } else {
                    //default to using the primary color if no secondary color is provided
                    $scope.currentObj['secondary_color'] = $scope.currentObj['primary_color'];
                }

                if($scope.status === 'new'){
                    $scope.currentObj.active = true;

                    BeltsStripesService.addNewBelt($scope.currentObj).then(
                        function(response){
                            //re-append the # back to the colors for the colorpicker
                            $scope.currentObj['primary_color'] = '#' + $scope.currentObj['primary_color'];
                            $scope.currentObj['secondary_color'] = '#' + $scope.currentObj['secondary_color'];

                            $scope.belts.push($scope.currentObj);
                            $scope.initCurrent('belt');

                        }, function(error){
                            console.log('failed to post belt successfully');
                        });
                } else {
                    BeltsStripesService.updateBelt($scope.currentObj).then(
                        function(response){
                            //re-append the # back to the colors for the colorpicker
                            $scope.currentObj['primary_color'] = '#' + $scope.currentObj['primary_color'];
                            $scope.currentObj['secondary_color'] = '#' + $scope.currentObj['secondary_color'];

                            $scope.initCurrent('belt');
                        }, function(error){
                            console.log('failed to update belt successfully');
                        });
                }
    		} else {
                //API doesn't take the # with the colors, strip it out
                $scope.currentObj.color = $scope.currentObj.color.slice(1);

                if($scope.status === 'new'){
                    $scope.currentObj.active = true;

                    BeltsStripesService.addNewStripe($scope.currentObj).then(
                        function(response){
                            //re-append the # back to the colors for the colorpicker
                            $scope.currentObj.color = '#' + $scope.currentObj.color;

                            $scope.stripes.push($scope.currentObj);
                            $scope.initCurrent('stripe');

                        }, function(error){
                            console.log('failed to post stripe successfully');
                        });
                } else {
                    BeltsStripesService.updateStripe($scope.currentObj).then(

                        function(response){
                            //re-append the # back to the colors for the colorpicker
                            $scope.currentObj.color = '#' + $scope.currentObj.color;

                            $scope.initCurrent('stripe');

                        }, function(error){
                            console.log('failed to update stripe successfully');
                        });
                }
    		}
        };

        // $scope.addNew = function(type){
        //     $scope.type = type;
        //     $scope.status = 'new';
        //     $scope.currentObj = $scope.initCurrent(type);

        //     $scope.showEdit = true;
        // };

        // $scope.edit = function(type, obj){
        //     $scope.type = type;
        //     $scope.status = 'edit';

        //     $scope.showEdit = true;
        //     $scope.currentObj = obj;
        //     $scope.name = $scope.currentObj.name;
        // };

        $scope.objSelect = function(type){
            console.log(type);

        };

        $scope.getBeltList();
        $scope.getStripeList();

    }]);

})();