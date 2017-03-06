(function() {

  angular.module('ttkdApp.manageUserCtrl',['ttkdApp.constants'])
    .controller('manageUserCtrl', ['$scope', '$rootScope', '$state', '$document',
      '$uibModal', '$http', 'apiHost', '$timeout',
      function($scope, $rootScope, $state, $document, $uibModal, $http, apiHost, $location, $timeout) {
      
      var modalInstance;

      $scope.reload = function() {
        $http.get(apiHost + '/api/users/'
        ).then(
          function(response) {
            console.log(response.data);
            $scope.userList = response.data;
          }
        );
      };

      $scope.reload();

      /*
       * Open a prompt to change the current user's password.
       */
      $scope.openDeleteUser = function(selectedID, selectedUsername) {
        $scope.selectedID = selectedID;
        $scope.selectedUsername = selectedUsername;
        var modalElement = angular.element($document[0].querySelector('#delete-modal'));

        modalInstance = $uibModal.open({
          animation: true,
          windowClass: 'delete-modal',
          ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'components/user-management/delete.modal.html',
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
      $scope.deleteUser  = function(selectedID) {
        

        $http.delete(apiHost + '/api/users/' + selectedID + '/', {
        }).then(
          function(response) {
            console.log(response.data);
            modalInstance.close();
            $scope.reload();
          },
          function(error) {
            console.log(error);
          }
        );
      };

      /*
       * Open a prompt to change the current user's password.
       */
      $scope.openCreateUser = function() {
        $scope.editingUser = false;
        $scope.selectedUsername = '';
        $scope.password = '';
        $scope.passwordRepeat = '';
        $scope.selectedStaff = false;
        var modalElement = angular.element($document[0].querySelector('#edit-modal'));

        modalInstance = $uibModal.open({
          animation: true,
          windowClass: 'edit-modal',
          ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'components/user-management/edit.modal.html',
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
      $scope.createUser  = function(selectedUsername, password, passwordRepeat, selectedStaff) {
        
        if(!(selectedUsername && password && passwordRepeat)) {
          $scope.passwordError = 'All fields must be completed';
          return;
        }
        if(password !== passwordRepeat) {
          $scope.passwordError = 'Passwords do not match';
          return;
        }

        $http.post(apiHost + '/api/users/', {
          username: selectedUsername,
          password: password,
          is_staff: selectedStaff || false
        }).then(
          function(response) {
            console.log(response.data);
            modalInstance.close();
            $scope.reload();
          },
          function(error) {
            console.log(error);
          }
        );
      };

      /*
       * Open a prompt to change the current user's password.
       */
      $scope.openEditUser = function(selectedID, selectedUsername, selectedStaff) {
        $scope.editingUser = true;
        $scope.selectedID = selectedID;
        $scope.selectedUsername = selectedUsername;
        $scope.selectedStaff = selectedStaff;

        var modalElement = angular.element($document[0].querySelector('#edit-modal'));

        modalInstance = $uibModal.open({
          animation: true,
          windowClass: 'edit-modal',
          ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'components/user-management/edit.modal.html',
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
      $scope.editUser  = function(selectedID, selectedUsername, selected_is_staff) {
        if(!selectedUsername) {
          $scope.passwordError = 'Must have a username';
          return;
        }


        $http.put(apiHost + '/api/userchangeinfo/' + selectedID + '/', {
          username: selectedUsername,
          is_staff: selected_is_staff || false
        }).then(
          function(response) {
            console.log(response.data);
            modalInstance.close();
            $scope.reload();
          },
          function(error) {
            console.log(error);
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
       * Open a prompt to change the current user's password.
       */
      $scope.openChangePass = function(selectedID, selectedUsername) {
        $scope.passwordError = '';
        var modalElement = angular.element($document[0].querySelector('#password-modal'));
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

        modalInstance.result.then(function (selectedItem) {
            //$ctrl.selected = selectedItem;
        }, function () {
        });
      };

      /*
       * Changes the password for the currently logged in user.
       */
      $scope.changePass = function(currentPass, password, passwordRepeat, selectedID) {
        //$timeout(function () { $scope.passwordError = '';}, 5000); // So that it is clear when the user creates a new error on submit
        
        if(!(currentPass && password && passwordRepeat)) {
          $scope.passwordError = 'All fields must be completed';
          return;
        }
        if(password !== passwordRepeat) {
          $scope.passwordError = 'Passwords do not match';
          return;
        }

        $http.put(apiHost + '/api/userchangepass/' + selectedID + '/', {
          password: password,
          currentPass: currentPass
        }).then(
          function(response) {
            console.log(response.data);
            modalInstance.close();
          },
          function(error) {
            console.log(error);
            $scope.passwordError = 'Invalid current password';
          }
        );
      };

    }]);

})();
