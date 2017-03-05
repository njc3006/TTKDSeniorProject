(function () {
    function StudentWaiverController($scope, $http, apiHost, FileUploader, SharedDataService, $cookies, $document, $uibModal, $filter) {
        var modalInstance;
        $scope.waivers = [];
        $scope.hasWaivers = false;

        $scope.newWaiverSig = '';
        $scope.newWaiverGuardSig = '';

        $scope.selectedDate = {
            open: false,
            value: null
        };

        var studentPromise = SharedDataService.getActiveStudent();

        $scope.uploadWaiver = function (waiverId) {
            document.getElementById('waiver-upload' + waiverId).click();
        };

        $scope.openWaiverModal = function () {
            var modalElement = angular.element($document[0].querySelector('#waiver-modal'));

            modalInstance = $uibModal.open({
                animation: true,
                windowClass: 'waiver-modal',
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                backdrop: 'static',
                keyboard: false,
                templateUrl: 'components/students/detail/view/student_waiver/waiver.modal.html',
                scope: $scope
            });
        };

        $scope.cancel = function () {
            modalInstance.close();
        };

        //opens the popup date picker window
        $scope.open = function () {
            $scope.selectedDate.open = true;
        };

        $scope.create = function (waiverSig, guardianSig) {

            var payload = {
                "person": SharedDataService.getStudentId(),
                "waiver_signature": waiverSig,
                "guardian_signature": guardianSig
            };

            if ($scope.selectedDate.value != null) {
                payload['signature_date'] = $filter('date')($scope.selectedDate.value, 'yyyy-MM-dd');
            }

            $http.post(apiHost + '/api/waivers/', payload).then(
                function (response) {
                    modalInstance.close();
                    $scope.getWaivers();
                }
            );
        };

        $scope.getWaivers = function () {
            studentPromise.then(function(student) {
                var waiversEndpoint = apiHost + '/api/waivers/?person=' + student.id;
                $scope.waivers = [];

                $http.get(waiversEndpoint).then(
                    function (response) {
                        $scope.waivers = response.data;
                        $scope.hasWaivers = ($scope.waivers.length > 0);

                        for (var i = 0; i < $scope.waivers.length; i++) {

                            var waiverUrl = $scope.waivers[i]['waiver_url'];

                            // If the waiver_url is not null lets fix the url by adding the api host
                            if (waiverUrl !== undefined && waiverUrl !== null) {
                                $scope.waivers[i]['waiver_url'] = apiHost + '/' + $scope.waivers[i]['waiver_url'];
                            }

                            $scope.waivers[i].formattedDate =
                                moment($scope.waivers[i]['signature_date']).format('MM/DD/YYYY');

                            $scope.waivers[i].waiverUploader = new FileUploader({
                                url: apiHost + '/api/waiver/' + $scope.waivers[i].id + '/image',
                                autoUpload: true,
                                headers: {
                                    Authorization: 'Token ' + $cookies.getObject('Authorization').token
                                }
                            });

                            $scope.waivers[i].waiverUploader.onSuccessItem = function () {
                                $scope.getWaivers();
                            };
                            $scope.waivers[i].age = moment($scope.waivers[i]['signature_date']).diff(moment(student.dob), 'years');
                        }

                });
            });
        };

        $scope.getWaivers();
    }

    angular.module('ttkdApp.studentWaiverCtrl', ['angularFileUpload', 'ngCookies'])
        .controller('StudentWaiverCtrl', [
            '$scope',
            '$http',
            'apiHost',
            'FileUploader',
            'SharedDataSvc',
            '$cookies',
            '$document',
            '$uibModal',
            '$filter',
            StudentWaiverController
        ]);
})();
