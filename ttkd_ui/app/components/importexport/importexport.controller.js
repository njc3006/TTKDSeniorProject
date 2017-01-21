(function () {
    angular.module('ttkdApp.importExportCtrl', ['ttkdApp.constants'])
        .controller('ImportExportCtrl', ['$scope', '$rootScope', '$filter', '$stateParams', 'ImportExportService',
            'apiHost','$document', '$uibModal',
            function ($scope, $rootScope, $filter, $stateParams, ImportExportService, apiHost, $document, $uibModal) {

                var modalInstance;
                $scope.apiHost = apiHost;
                $scope.modalMessage ="";
                $scope.modalDisabledOk = true;

                $scope.backup = function() {
                    $scope.modalMessage ="Please wait while we create a system backup.....";
                    $scope.openExportModal();
                    $scope.createBackup();
                };

                $scope.createBackup = function(){
                ImportExportService.initiateBackup().then(
                    function(response) {
                        var createdFile = response.data["File"];
                        $scope.modalMessage ="System backup created. File: " + createdFile;
                        $scope.modalDisabledOk = false;
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

                $scope.ok = function() {
                    modalInstance.dismiss('ok');
                }
            }]);
})();