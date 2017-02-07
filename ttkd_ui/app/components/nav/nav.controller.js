(function() {

  angular.module('ttkdApp.navCtrl', [])

    .controller('NavCtrl', ['$scope', '$rootScope', '$state', '$document',
      '$uibModal', '$http', 'ngCookies',
      function($scope, $rootScope, $state, $document, $uibModal, $http, apiHost, $cookies) {
      $rootScope.showCurrentProgram = true;
      $rootScope.showLogin = true;
      $rootScope.loggedin = ($cookies.getObject('Authorization').token ?  true:false);
      $rootScope.currentUser = $cookies.getObject('Authorization').name || '';
      var modalInstance;

    	// returns true if the current router url matches the passed in url
    	// so views can set 'active' on links easily
    	$scope.isUrl = function(url) {
    		if (url === '#') {
          return false;
        } else {
          return ('#' + $state.$current.url.source + '/').indexOf(url + '/') === 0;
        }
    	};

      /*
       * Open a prompt to confirm login for a person.
       */
      $scope.openLogin = function() {
        var modalElement = angular.element($document[0].querySelector('#login-modal'));

        modalInstance = $uibModal.open({
          animation: true,
          windowClass: 'login-modal',
          ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'components/nav/login.modal.html',
          scope: $scope
        });

        modalInstance.result.then(function (selectedItem) {
            //$ctrl.selected = selectedItem;
        }, function () {
        });
      };

      /*
       * Logs a user out.
       */
      $scope.login = function() {
        $http.post(apiHost + '/api/token-auth/', {}).then(
          function(response) {
            var authToken = response.data.token;

            $http.get(apiHost + '/api/users/current').then(
              function(response) {
                $cookies.putObject('Authorization', response.data);
                $rootScope.currentUser = response.data.token;
                $rootScope.loggedin = true;
              }
            );
          }
        );
      };

      /*
       * Logs a user out.
       */
      $scope.logout = function() {
        $cookies.remove('Authorization');
        $rootScope.currentUser = '';
        $rootScope.loggedin = false;     
      };


    }]);

})();
