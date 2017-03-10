(function() {

  angular.module('ttkdApp.manageUserCtrl',['ttkdApp.constants'])
    .controller('manageUserCtrl', ['$scope', '$uibModal', '$http', 'apiHost',
      function($scope, $uibModal, $http, apiHost) {
      
      var modalInstance;
      $scope.closeAlert = function(alert){
          $scope.statusAlert[alert] = false;
      };

      $scope.reload = function() {
        $http.get(apiHost + '/api/users/'
        ).then(
          function(response) {
            $scope.userList = response.data;
          }
        );
      };

      $scope.clearAlerts = function() {
        $scope.statusAlert = {
            failure: false,
            missing: false,
            passwords: false,
            success: false
        };
      }

      $scope.clearAlerts();
      $scope.reload();

      /*
       * Open a prompt to delete the currently selected user.
       */
      $scope.openDeleteUser = function(selectedID, selectedUsername) {
        $scope.clearAlerts();

        $scope.selectedID = selectedID;
        $scope.selectedUsername = selectedUsername;

        modalInstance = $uibModal.open({
          animation: true,
          windowClass: 'delete-modal',
          ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'components/user-management/delete.modal.html',
          scope: $scope
        });
      };

      /*
       * Queries the api to delete the currently selected user.
       */
      $scope.deleteUser  = function(selectedID) {
        

        $http.delete(apiHost + '/api/users/' + selectedID + '/').then(
          function(response) {
            modalInstance.close();
            $scope.statusAlert.success = true;
            $scope.reload();
          },
          function(error) {
            $scope.statusAlert.failure = true;
          }
        );
      };

      /*
       * Open a prompt to create a new user.
       */
      $scope.openCreateUser = function() {
        $scope.clearAlerts();

        $scope.editingUser = false;
        $scope.newUsername = '';
        $scope.selectedUsername = '';
        $scope.password = '';
        $scope.passwordRepeat = '';
        $scope.selectedStaff = false;

        modalInstance = $uibModal.open({
          animation: true,
          windowClass: 'edit-modal',
          ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'components/user-management/edit.modal.html',
          scope: $scope
        });
      };

      /*
       * Queries the api to create a new user with the provided field values.
       */
      $scope.createUser  = function(selectedUsername, password, passwordRepeat, selectedStaff) {
        
        if(!(selectedUsername && password && passwordRepeat)) {
          $scope.statusAlert.missing = true;
          return;
        }
        else {
          $scope.statusAlert.missing = false;
        }

        if(password !== passwordRepeat) {
          $scope.statusAlert.password = true;
          return;
        }
        else {
          $scope.statusAlert.password = false;
        }

        $http.post(apiHost + '/api/users/', {
          username: selectedUsername,
          password: password,
          is_staff: selectedStaff || false
        }).then(
          function(response) {
            modalInstance.close();
            $scope.statusAlert.success = true;
            $scope.reload();
          },
          function(error) {
            $scope.statusAlert.failure = true;
          }
        );
      };

      /*
       * Open a prompt to edit the selected user's username and admin status.
       */
      $scope.openEditUser = function(selectedID, selectedUsername, selectedStaff) {
        $scope.clearAlerts();

        $scope.editingUser = true;
        $scope.selectedID = selectedID;
        $scope.newUsername = selectedUsername;
        $scope.selectedUsername = selectedUsername;
        $scope.selectedStaff = selectedStaff;


        modalInstance = $uibModal.open({
          animation: true,
          windowClass: 'edit-modal',
          ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'components/user-management/edit.modal.html',
          scope: $scope
        });
      };

      /*
       * Queries the api to edit the currently selected user.
       */
      $scope.editUser  = function(selectedID, selectedUsername, selected_is_staff) {
        if(!selectedUsername) {
          $scope.statusAlert.missing = true;
          return;
        }
        else {
          $scope.statusAlert.missing = false;
        }


        $http.put(apiHost + '/api/userchangeinfo/' + selectedID + '/', {
          username: selectedUsername,
          is_staff: selected_is_staff || false
        }).then(
          function(response) {
            modalInstance.close();
            $scope.statusAlert.success = true;
            $scope.reload();
          },
          function(error) {
            $scope.statusAlert.failure = true;
          }
        );
      };

      /*
       * Closes the current modal.
       */
      $scope.cancelModal  = function() {
        modalInstance.close();
      };

      /*
       * Open a prompt to change the current user's password.
       */
      $scope.openChangePass = function(selectedID, selectedUsername) {
        $scope.clearAlerts();

        $scope.selectedID = selectedID;
        $scope.selectedUsername = selectedUsername;

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
          $scope.statusAlert.missing = true;
          return;
        }
        else {
          $scope.statusAlert.missing = false;
        }

        if(password !== passwordRepeat) {
          $scope.statusAlert.password = true;
          return;
        }
        else {
          $scope.statusAlert.password = false;
        }

        $http.put(apiHost + '/api/userchangepass/' + selectedID + '/', {
          password: password,
          currentPass: currentPass
        }).then(
          function(response) {
            modalInstance.close();
            $scope.statusAlert.success = true;
          },
          function(error) {
            if(error.status === 403) {
              $scope.statusAlert.incorrect = true;
            }
            else {
              $scope.statusAlert.failure = true;
            }
          }
        );
      };

    }]);

})();
