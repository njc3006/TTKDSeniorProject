(function () {
    angular.module('ttkdApp.importExportCtrl', ['ttkdApp.constants'])
        .controller('ImportExportCtrl', [
                '$scope',
                '$rootScope', 
                '$filter', 
                '$stateParams', 
                'ImportExportService',
                'apiHost',
                '$document', 
                '$uibModal', 
                '$window',
                '$http',
            function (
                $scope, 
                $rootScope, 
                $filter, 
                $stateParams, 
                ImportExportService, 
                apiHost, 
                $document, 
                $uibModal, 
                $window,
                $http
            ) {

                var modalInstance;
                $scope.apiHost = apiHost;
                $scope.modalMessage = '';
                $scope.modalDisabledOk = true;
                $scope.modalDisabledConfirm = true;
                $scope.modalConfirmTitle = '';
                $scope.modalTitle = '';

                $scope.backup = function() {
                    $scope.modalMessage = 'Please wait while we create a system backup.....';
                    $scope.modalTitle = 'Backup';
                    $scope.openExportModal();
                    $scope.createBackup();
                };

                $scope.createBackup = function(){
                    ImportExportService.initiateBackup().then(
                        function(response) {
                            var createdFile = response.data['File'];
                            $scope.modalMessage ='System backup created. File: ' + createdFile;
                            $scope.modalDisabledOk = false;
                        });
                };

                $scope.restore = function(data) {
                    ImportExportService.importBackup(data).then(
                        function(response) {
                            $scope.modalMessage = response.data;
                            $scope.modalTitle = 'Restore - Successful';
                            $scope.modalDisabledOk = false;
                        },
                        function(error) {
                            $scope.modalMessage = 'Something went wrong while restoring the system, ' +
                                'please make sure your backup file is a correctly formated json file.' +
                                ' The error message is: ' + error.data['detail'];
                            $scope.modalTitle = 'Restore - Error';
                            $scope.modalDisabledOk = false;
                        }
                    );
                };

                $scope.exportAttendanceRecords = function() {
                    $scope.modalTitle = "Export Attendance Records";
                    $scope.exportError = "";
                    $scope.showExportError = false;
                    $scope.loadingExport = true;
                    $scope.fileUrl = "#";
                    openCSVModal();
                    ImportExportService.exportAttendance().then(
                        function(response) {
                           $scope.loadingExport = false;
                           $scope.fileUrl = apiHost + response.data.url;
                        },
                        function(response) {
                            if(response.statusText != "") {
                                $scope.exportError = response.statusText;
                            } else {
                                $scope.exportError = "An error occured connecting to the server."
                            }
                            $scope.loadingExport = false;
                            $scope.showExportError = true;
                        }
                    );
                };

                $scope.exportContacts = function() {
                    $scope.modalTitle = "Export Contacts";
                    $scope.exportError = "";
                    $scope.showExportError = false;
                    $scope.loadingExport = true;
                    $scope.fileUrl = "#";
                    openCSVModal();
                    ImportExportService.exportContacts().then(
                        function(response) {
                           $scope.loadingExport = false;
                           $scope.fileUrl = apiHost + response.data.url;
                        },
                        function(response) {
                            if(response.statusText != "") {
                                $scope.exportError = response.statusText;
                            } else {
                                $scope.exportError = "An error occured connecting to the server."
                            }
                            $scope.loadingExport = false;
                            $scope.showExportError = true;
                        }
                    );
                };

                $scope.fileChosen = function () {
                     $scope.modalDisabledConfirm = false;
                     $scope.modalConfirmTitle = '';
                };

                var openCSVModal = function() {
                    var modalElement = angular.element($document[0].querySelector('#modal-area'));
                    $scope.showCSVModal = true;

                    modalInstance = $uibModal.open({
                        animation: true,
                        backdrop  : 'static',
                        keyboard  : false,
                        windowClass: 'export-modal',
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'components/importexport/export-csv.modal.html',
                        scope: $scope
                    });

                    modalInstance.result.then(function (selectedItem) {
                    }, function () {
                    });
                };

                $scope.openExportModal = function() {
                    var modalElement = angular.element($document[0].querySelector('#modal-area'));
                    $scope.modalDisabledOk = true;

                    modalInstance = $uibModal.open({
                        animation: true,
                        backdrop  : 'static',
                        keyboard  : false,
                        windowClass: 'export-modal',
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'components/importexport/export.modal.html',
                        scope: $scope
                    });

                    modalInstance.result.then(function (selectedItem) {
                    }, function () {
                    });
                };

                 $scope.openRestoreWarningModal = function() {
                    var modalElement = angular.element($document[0].querySelector('#modal-area'));
                    $scope.modalDisabledConfirm = true;
                    $scope.modalConfirmTitle = 'Please select a file';

                    modalInstance = $uibModal.open({
                        animation: true,
                        backdrop  : 'static',
                        keyboard  : false,
                        windowClass: 'import-warning-modal',
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'components/importexport/import-warning.modal.html',
                        scope: $scope
                    });

                    modalInstance.result.then(function (selectedItem) {
                    }, function () {
                    });
                };

                $scope.ok = function() {
                    modalInstance.dismiss('ok');
                };

                $scope.cancelRestore = function() {
                    modalInstance.dismiss('cancelRestore');
                };

                $scope.confirmRestore = function() {
                    var file = document.getElementById('filepicker').files[0];

                    if (file === undefined){
                        $scope.modalDisabledConfirm = true;
                        $scope.modalConfirmTitle = 'Please select a file';
                    }
                    else {
                        var reader = new FileReader();
                        reader.onloadend = function (e) {
                            var data = e.target.result;
                            $scope.restore(data);
                        };
                        reader.readAsBinaryString(file);
                        modalInstance.dismiss('confirmRestore');

                        $scope.modalMessage = 'Please wait while we restore the system';
                        $scope.modalTitle = 'Restoring';
                        $scope.openExportModal();
                    }
                };
            }]);
})();