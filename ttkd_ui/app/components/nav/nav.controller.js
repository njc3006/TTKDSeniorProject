(function() {

  angular.module('ttkdApp.navCtrl', ['ngCookies'])

    .controller('NavCtrl', ['$scope', '$rootScope', '$state', '$document',
      '$uibModal', '$http', 'apiHost', '$cookies',
      function($scope, $rootScope, $state, $document, $uibModal, $http, apiHost, $cookies) {
      $rootScope.showCurrentProgram = true;
      $rootScope.showLogin = true;
      $rootScope.loggedin = ($cookies.getObject('Authorization') ?  true:false);
      $rootScope.currentUser = $cookies.getObject('Authorization') ? $cookies.getObject('Authorization').username : 'Anonymous';
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
      $scope.login = function(username, password) {
        $http({
          method: 'POST',
          url: apiHost + '/api/token-auth/',
          data: {
          username: username,
          password: password,
        }}).then(
          function(response) {
            var authToken = response.data.token;
            alert(authToken);

            $http.get(apiHost + '/api/users/current/', {
              headers: {
                'Authorization': 'Token ' + authToken,
              }
            }).then(
              function(response) {
                console.log(response.data);
                var authData = {
                  token: authToken,
                  username: response.data.username,
                  userlevel: response.data['is_staff'],
                };
                $cookies.putObject('Authorization', authData);
                $rootScope.currentUser = response.data.username;
                $rootScope.loggedin = true;
              }
            );
            modalInstance.dismiss();
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
