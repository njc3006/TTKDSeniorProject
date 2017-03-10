(function() {

  angular.module('ttkdApp.navCtrl', ['ngCookies'])

    .controller('NavCtrl', ['$scope', '$rootScope', '$state', '$document',
      '$uibModal', '$http', 'apiHost', '$cookies', '$location',
      function($scope, $rootScope, $state, $document, $uibModal, $http, apiHost, $cookies, $location) {
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
        $scope.statusAlert = {
            failure: false,
            password: false,
            missing: false
        };

        var modalElement = angular.element($document[0].querySelector('#login-modal'));

        modalInstance = $uibModal.open({
          animation: true,
          windowClass: 'login-modal',
          ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'components/nav/login.modal.html',
          scope: $scope
        });
      };

      /*
       * Logs a user out.
       */
      $scope.login = function(username, password) {
        if(!(username && password)) {
          $scope.statusAlert['missing'] = true;
          return;
        }
        else {
          $scope.statusAlert['missing'] = false;
        }

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
            modalInstance.close();
          },
          function(error) {
            console.log(error);
            if(error.status === 400 && error.data.non_field_errors && error.data.non_field_errors[0] === "Unable to log in with provided credentials.") {
              $scope.statusAlert['password'] = true;
            }
            else {
              $scope.statusAlert['failure'] = true;
            }
          }
        );
      };

      /*
       * Closes the modal that is currently open.
       */
      $scope.cancelModal  = function() {
        modalInstance.close();
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
        $scope.statusAlert = {
            failure: false,
            missing: false,
            passwords: false
        };

        var modalElement = angular.element($document[0].querySelector('#password-modal'));

        modalInstance = $uibModal.open({
          animation: true,
          windowClass: 'password-modal',
          ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'components/user-management/password.modal.html',
          scope: $scope
        });
      };

      /*
       * Changes the password for the currently logged in user.
       */
      $scope.changePass = function(currentPass, password, passwordRepeat, selectedID) {
        if(!(currentPass && password && passwordRepeat)) {
          $scope.statusAlert['missing'] = true;
          return;
        }
        else {
          $scope.statusAlert['missing'] = false;
        }

        if(password !== passwordRepeat) {
          $scope.statusAlert['password'] = true;
          return;
        }
        else {
          $scope.statusAlert['password'] = false;
        }

        $http.put(apiHost + '/api/userchangepass/current/', {
          password: password,
          currentPass: currentPass
        }).then(
          function(response) {
            modalInstance.close();
          },
          function(error) {
            if(error.status === 403) {
              $scope.statusAlert['incorrect'] = true;
            }
            else {
              $scope.statusAlert['failure'] = true;
            }
          }
        );
      };
    }]);

})();
