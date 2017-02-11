(function() {

  angular.module('ttkdApp.beltsStripesCtrl', ['ttkdApp.constants'])

    .controller('BeltsStripesCtrl', ['$scope', '$rootScope', '$stateParams', 'BeltsStripesService', 
        function($scope, $rootScope, $stateParams, BeltsStripesService) {
        $rootScope.showCurrentProgram = !$stateParams.hideCurrentProgram;

        $scope.belts = [];
        $scope.stripes = [];
        $scope.showEdit = false;
        $scope.active = false;
        $scope.status = '';
        $scope.type = '';
        $scope.pageTitle = '';
        $scope.currentObj = {};


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
                    $scope.belts = response.data;
                });
        };

        $scope.getStripeList = function(){
            BeltsStripesService.getStripeList().then(
                function(response){
                    $scope.stripes = response.data;
                });
        };

        $scope.save = function(){
        	if($scope.status === 'new'){
        		if($scope.type === 'belt'){
                    //post belt

                    //API doesn't take the # with the colors, strip it out
                    $scope.currentObj['primary_color'] = $scope.currentObj['primary_color'].slice(1);

                    if($scope.currentObj['secondary_color'] !== ''){
                        $scope.currentObj['secondary_color'] = 
                                                    $scope.currentObj['secondary_color'].slice(1);                    
                    } else {
                        //default to using the primary color if no secondary color is provided
                        $scope.currentObj['secondary_color'] = $scope.currentObj['primary_color'];
                    }

                    $scope.currentObj.active = true;

                    BeltsStripesService.addNewBelt($scope.currentObj).then(
                        function(response){

                            //re-append the # back to the colors for the colorpicker
                            $scope.currentObj['primary_color'] = '#' + $scope.currentObj['primary_color'];
                            $scope.currentObj['secondary_color'] = '#' + $scope.currentObj['secondary_color'];

                            $scope.belts.push($scope.currentObj);
                            $scope.initCurrent('belt');

                            $scope.backNavigate();
                        }, function(error){
                            console.log('failed to post belt successfully');
                        });
        		} else {
        			//post stripe

                    //API doesn't take the # with the colors, strip it out
                    $scope.currentObj.color = $scope.currentObj.color.slice(1);
                    $scope.currentObj.active = true;

                    BeltsStripesService.addNewStripe($scope.currentObj).then(
                        function(response){
                            //re-append the # back to the colors for the colorpicker
                            $scope.currentObj.color = '#' + $scope.currentObj.color;

                            $scope.stripes.push($scope.currentObj);
                            $scope.initCurrent('stripe');

                            $scope.backNavigate();
                        }, function(error){
                            console.log('failed to post stripe successfully');
                        });
        		}
        	} else {
        		if($scope.type === 'belt'){
        			//put belt
        		} else {
        			//put stripe
        		}
        	}
        };

        $scope.addNew = function(type){
            $scope.type = type;
            $scope.status = 'new';
            $scope.currentObj = $scope.initCurrent(type);

            $scope.showEdit = true;
        };

        $scope.edit = function(type, obj){
            $scope.type = type;
            $scope.status = 'edit';

            $scope.showEdit = true;
            $scope.active = true;

            $scope.currentObj = obj;
            $scope.name = $scope.currentObj.name;
        };

        $scope.backNavigate = function() {
            $scope.showEdit = false;
            $scope.active = false;
            $scope.status = '';
            $scope.type = '';
            $scope.pageTitle = '';
        };

        $scope.getBeltList();
        $scope.getStripeList();

    }]);

})();