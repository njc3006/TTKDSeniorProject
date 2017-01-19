(function () {
    angular.module('ttkdApp.importExportCtrl', ['ttkdApp.constants'])
        .controller('ImportExportCtrl', ['$scope', '$rootScope', '$filter', '$stateParams', 'ImportExportService',
            'apiHost','$document', '$uibModal',
            function ($scope, $rootScope, $filter, $stateParams, ImportExportService, apiHost, $document, $uibModal) {

                $scope.apiHost = apiHost;
                $scope.modalMessage ="";

                $scope.backup = function() {
                    $scope.modalMessage ="Please wait while we create a system backup.....";
                    $scope.openExportModal();
                    var results = ImportExportService.initiateBackup();

                    console.log(results);
                    $scope.modalMessage ="System backup created";
                };


                $scope.openExportModal = function() {
                    var modalElement = angular.element($document[0].querySelector('#modal-area'));

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