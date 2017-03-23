(function () {
    function EditStudentController(
        $scope,
        $state,
        $stateParams,
        $timeout,
        $q,
        $window,
        StudentsService,
        StateService,
        ProgramsService){

        var programsTouched = false;
        var allPrograms = [];
        $scope.registeredPrograms = [];
        $scope.programsToAdd = [];

        ProgramsService.getPrograms().then(
            function (response) {
                allPrograms = response.data;
                initPrograms();
            }
        );

        function initPrograms() {
            // initialize registered programs
            StudentsService.getStudentRegistrations($stateParams.studentId).then(
                function (response) {
                    $scope.registeredPrograms = response.data;
                    // get all active programs and remove already registered ones
                    var programsToShow = allPrograms;
                    // double loop is necessary to remove registered programs
                    angular.forEach($scope.registeredPrograms, function (registeredProgram) {
                        angular.forEach(programsToShow, function (program) {
                            if (registeredProgram.programId === program.id) {
                                programsToShow.splice(programsToShow.indexOf(program), 1);
                            }
                        });
                    });
                    $scope.programsToAdd = programsToShow;
                }
            );
        }

        $scope.registerForProgram = function (program) {
            if (program) {
                programsTouched = true;
                $scope.programsToAdd.splice($scope.programsToAdd.indexOf(program), 1);
                $scope.registeredPrograms.push(program);
            }
        };

        /* remove a student from the selected class */
        $scope.unregister = function (program) {
            programsTouched = true;
            $scope.registeredPrograms.splice($scope.registeredPrograms.indexOf(program), 1);
            $scope.programsToAdd.push(program);
        };

        function updateRegistrations() {
            var promises = [];
            /* iterate through all the programs in our "registered" list, and if they aren't actually registered yet,
             create a registration */
            angular.forEach($scope.registeredPrograms, function (program) {
                if (!program.registrationId) {
                    promises.push(StudentsService.registerStudent($stateParams.studentId, program.id).then(
                        function (response) {
                            // no news is good news :)
                        },
                        // on errors
                        function (response) {
                            $scope.requestFlags.submission.failure = true;
                            $window.scrollTo(0, 0);
                        }
                    ));
                }
            });
            /* iterate through each program that is unregistered, check if it is actually registered, and delete
             the registration if so */
            angular.forEach($scope.programsToAdd, function (program) {
                if (program.registrationId) {
                    promises.push(StudentsService.deleteRegistration(program.registrationId).then(
                        function (response) {
                            // no news is good news
                        },
                        // on error
                        function (response) {
                            $scope.requestFlags.submission.failure = true;
                            $window.scrollTo(0, 0);
                        }
                    ));
                }
                $q.all(promises).then(function () {
                    initPrograms();
                });
            });
        }

        function submitStripeChanges() {
            StudentsService.updateStudentStripes(
                $stateParams.studentId,
                $scope.studentInfo.oldStripes,
                $scope.studentInfo.stripes
            ).then(
                function success(responses) {
                    $scope.studentInfo.oldStripes = responses.filter(function (response) {
                        return response.data['current_stripe'];
                    }).map(function (response) {
                        return response.data;
                    });

                    $scope.oldStudent = angular.copy($scope.studentInfo);

                    $window.scrollTo(0, 0);
                    $scope.requestFlags.submission.success = true;
                },
                function failure(error) {
                    $scope.requestFlags.submission.failure = true;
                    $window.scrollTo(0, 0);
                }
            );
        }

        $scope.backNavigate = function () {
            if (!angular.equals($scope.oldStudent, $scope.studentInfo) || programsTouched) {
                var shouldBackNavigate = confirm('There are unsaved changes, are you sure you wish to leave?');

                if (shouldBackNavigate) {
                    if ($stateParams.backToCheckinID !== null) {
                        $state.go('checkin', {programID: $stateParams.backToCheckinID})
                    } else {
                        $state.go('studentDetails', {studentId: $stateParams.studentId,
                            backToCheckinID: $stateParams.viewBackToCheckinID});
                    }
                }
            }
            else {
                if ($stateParams.backToCheckinID !== null) {
                    $state.go('checkin', {programID: $stateParams.backToCheckinID})
                } else {
                    $state.go('studentDetails', {studentId: $stateParams.studentId,
                            backToCheckinID: $stateParams.viewBackToCheckinID});
                }
            }
        };

        $scope.anySecondaryContactInfoEntered = function () {
            if ($scope.studentInfo === undefined) {
                return false;
            } else if (!$scope.studentInfo['emergency_contact_2']) {
                return false;
            }

            var secondary = $scope.studentInfo['emergency_contact_2'];
            var secondaryFullNameEntered = secondary['full_name'] !== undefined && secondary['full_name'].length > 0;
            var secondaryPhoneEntered = secondary['phone_number'] !== undefined && secondary['phone_number'].length > 0;
            var secondaryRelationEntered = secondary.relation !== undefined && secondary.relation.length > 0;

            return secondaryFullNameEntered || secondaryPhoneEntered || secondaryRelationEntered;
        };

        $scope.addEmail = function () {
            $scope.studentInfo.emails.push({email: ''});
        };

        $scope.removeEmail = function (index) {
            $scope.studentInfo.emails.splice(index, 1);
        };

        $scope.openDob = function () {
            $scope.studentInfo.dob.open = true;
        };

        $scope.closeSuccessAlert = function () {
            $scope.requestFlags.submission.success = false;
        };

        $scope.closeErrorAlert = function () {
            $scope.requestFlags.submission.failure = false;
        };

        $scope.submitChanges = function (formIsValid) {
            if (formIsValid) {
                updateRegistrations();
                programsTouched = false;
                var payload = angular.copy($scope.studentInfo);
                payload = angular.extend(payload, {
                    dob: moment($scope.studentInfo.dob.value).format('YYYY-MM-DD'),
                    state: $scope.studentInfo.state.value
                });

                StudentsService.updateStudentInfo($stateParams.studentId, payload, $scope.userlevel).then(
                    function success(response) {
                        $scope.oldStudent = angular.copy($scope.studentInfo);

                        if ($scope.studentInfo.newBelt.id !== $scope.currentBelt.id) {
                            StudentsService.updateStudentBelt(
                                $stateParams.studentId,
                                $scope.studentInfo.newBelt.id
                            ).then(
                                function success(responses) {
                                    $scope.currentBelt = $scope.studentInfo.newBelt;
                                    $scope.oldPersonBelt = $scope.currentBelt;
                                    submitStripeChanges();
                                },
                                function failure(error) {
                                    $scope.requestFlags.submission.failure = true;
                                    $window.scrollTo(0, 0);
                                }
                            );
                        } else {
                            submitStripeChanges();
                        }
                    }, function failure(error) {
                        $scope.requestFlags.submission.failure = true;
                        $window.scrollTo(0, 0);
                    }
                );
            }
        };

        $scope.requestFlags = {
            loading: {
                done: false,
                failure: false
            },
            submission: {
                success: false,
                failure: false
            },
        };

        $scope.selectedFromAllStripes = [];
        $scope.selectedFromStudentStripes = [];

        $scope.studentInfo = {};

        $scope.states = StateService.getStates();

        StudentsService.getStudent($stateParams.studentId).then(function success(response) {
            $scope.studentInfo = response.data;

            $scope.studentInfo.oldStripes = $scope.studentInfo.stripes.filter(function (stripe) {
                return stripe['current_stripe'];
            }).map(function (stripe) {
                var copy = {};
                angular.copy(stripe, copy);
                return copy;
            });

            $scope.studentInfo.stripes = $scope.studentInfo.stripes.filter(function (stripe) {
                return stripe['current_stripe'];
            }).map(function (personStripe) {
                var copy = {};
                angular.copy(personStripe.stripe, copy);
                copy.active = false;
                return copy;
            });

            $scope.studentInfo.dob = {
                value: moment($scope.studentInfo.dob, 'YYYY-MM-DD').toDate(),
                open: false
            };

            $scope.studentInfo.state = {
                name: $scope.studentInfo.state,
                value: $scope.studentInfo.state
            };

            // Add empty entries to emergency contacts as necessary (up to 2)
            if (!$scope.studentInfo['emergency_contact_1']) {
                $scope.studentInfo['emergency_contact_1'] = {};
            }

            if (!$scope.studentInfo['emergency_contact_2']) {
                $scope.studentInfo['emergency_contact_2'] = {};
            }

            if ($scope.studentInfo.belt) {
                $scope.currentBelt = $scope.studentInfo.belt;
                $scope.studentInfo.newBelt = angular.copy($scope.currentBelt);
                $scope.oldPersonBelt = $scope.currentBelt;
            }

            $scope.oldStudent = angular.copy($scope.studentInfo);
            $scope.requestFlags.loading.done = true;

        }, function failure(error) {
            $scope.requestFlags.loading.failure = true;
            $scope.requestFlags.loading.done = true;
        });

        $scope.$watch('studentInfo["newBelt"]', function (newBelt) {
            if (!newBelt) {
                return;
            }

            if (newBelt.id !== $scope.currentBelt.id) {
                $scope.studentInfo.stripes = [];
            } else {
                $scope.studentInfo.stripes = $scope.studentInfo.oldStripes.map(function (personStripe) {
                    var copy = {};
                    angular.copy(personStripe.stripe, copy);
                    copy.active = false;
                    return copy;
                });
            }
        });
    }

    angular.module('ttkdApp.editStudentCtrl', [
        'ttkdApp.studentsService',
        'ttkdApp.stateService',
        'ttkdApp.emergencyContactDir',
        'ttkdApp.constants'
    ]).controller('EditStudentCtrl', [
        '$scope',
        '$state',
        '$stateParams',
        '$timeout',
        '$q',
        '$window',
        'StudentsSvc',
        'StateSvc',
        'ProgramsSvc',
        EditStudentController
    ]);
})();
