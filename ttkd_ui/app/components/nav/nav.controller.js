(function() {

  angular.module('ttkdApp.navCtrl', ['ngCookies'])

    .controller('NavCtrl', ['$scope', '$rootScope', '$state', '$document',
      '$uibModal', '$http', 'apiHost', '$cookies', '$location', '$timeout',
      function($scope, $rootScope, $state, $document, $uibModal, $http, apiHost, $cookies, $location, $timeout) {
      $rootScope.showCurrentProgram = true;
      $rootScope.showLogin = true;
      $rootScope.loggedin = ($cookies.getObject('Authorization') ?  true:false);
      $rootScope.currentUser = $cookies.getObject('Authorization') ?
        $cookies.getObject('Authorization').username : 'Anonymous';
      $rootScope.userlevel = $cookies.getObject('Authorization') ?
        $cookies.getObject('Authorization').userlevel : -1;
      $rootScope.currentUserID = $cookies.getObject('Authorization') ?
        $cookies.getObject('Authorization').currentUserID : -1;
      var modalInstance;

      $scope.reload = function() {
        location.reload();
      };

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
        $scope.loginError = '';
        var modalElement = angular.element($document[0].querySelector('#login-modal'));

        modalInstance = $uibModal.open({
          animation: true,
          windowClass: 'login-modal',
          ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'components/user-management/login.modal.html',
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
        $scope.loginError = '';
        $http({
          method: 'POST',
          url: apiHost + '/api/token-auth/',
          data: {
          username: username,
          password: password,
        }}).then(
          function(response) {
            var authToken = response.data.token;

            $scope.loginError = '';

            $http.get(apiHost + '/api/users/current/', {
              headers: {
                'Authorization': 'Token ' + authToken,
              }
            }).then(
              function(response) {
                var authData = {
                  token: authToken,
                  username: response.data.username,
                  userlevel: response.data['is_staff'] ? 1:0,
                  currentUserID: response.data.id
                };
                $cookies.putObject('Authorization', authData);
                $rootScope.currentUser = response.data.username;
                $rootScope.loggedin = true;
                $rootScope.currentUser = $cookies.getObject('Authorization').username;
                $rootScope.userlevel = $cookies.getObject('Authorization').userlevel;
                $rootScope.currentUserID = $cookies.getObject('Authorization').currentUserID;
                $scope.reload();
              }
            );
            modalInstance.dismiss();
          },
          function(error) {
            $scope.loginError = 'Invalid credentials';
          }
        );
      };

      /*
       * Changes the password for the currently logged in user.
       */
      $scope.cancelModal  = function() {
        modalInstance.dismiss();
      };

      /*
       * Logs a user out.
       */
      $scope.logout = function() {
        $cookies.remove('Authorization');
        $rootScope.currentUser = '';
        $rootScope.loggedin = false;
        $rootScope.currentUser = 'Anonymous';
        $rootScope.userlevel = -1;
        $location.path('/');
      };

      /*
       * Open a prompt to change the current user's password.
       */
      $scope.openChangePass = function() {
        $scope.passwordError = '';
        var modalElement = angular.element($document[0].querySelector('#password-modal'));

        modalInstance = $uibModal.open({
          animation: true,
          windowClass: 'password-modal',
          ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'components/user-management/password.modal.html',
          scope: $scope
        });

        modalInstance.result.then(function (selectedItem) {
            //$ctrl.selected = selectedItem;
        }, function () {
        });
      };

      /*
       * Changes the password for the currently logged in user.
       */
      $scope.changePass = function(currentPass, password, passwordRepeat, selectedID) {
        $timeout(function () { $scope.passwordError = '';}, 5000); // So that it is clear when the user creates a new error on submit
        
        if(!(currentPass && password && passwordRepeat)) {
          $scope.passwordError = 'All fields must be completed';
          return;
        }
        if(password !== passwordRepeat) {
          $scope.passwordError = 'Passwords do not match';
          return;
        }

        $http.put(apiHost + '/api/userchangepass/current/', {
          password: password,
          currentPass: currentPass
        }).then(
          function(response) {
            modalInstance.dismiss();
          },
          function(error) {
            $scope.passwordError = 'Invalid current password';
          }
        );
      };
    }]);

})();
