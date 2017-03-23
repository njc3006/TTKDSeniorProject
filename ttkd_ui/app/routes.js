(function () {

    angular.module('ttkdApp.routes', ['ui.router'])

        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'components/home/home.html',
                    controller: 'HomeCtrl',
                    data: {
                        pageTitle: 'Home'
                    }
                })

                .state('importexport', {
                    url: '/importexport',
                    params: {hideCurrentProgram: true},
                    templateUrl: 'components/importexport/importexport.html',
                    controller: 'ImportExportCtrl'
                })

                .state('checkin', {
                    url: '/checkin/{programID:int}',
                    templateUrl: 'components/checkin/checkin.html',
                    controller: 'CheckinCtrl',
                    data: {
                        pageTitle: 'Checkin'
                    }
                })

                .state('registration', {
                    url: '/registration',
                    params: {
                        hideCurrentProgram: true,
                        partial: false
                    },
                    data: {
                        pageTitle: 'Registration'
                    },
                    templateUrl: 'components/registration/registration.html',
                    controller: 'RegistrationCtrl'
                })

                .state('partialRegistrations', {
                    url: '/partial-registrations',
                    params: {
                        hideCurrentProgram: true
                    },
                    data: {
                        pageTitle: 'Partial Registrations'
                    },
                    templateUrl: 'components/registration/partials_home/partials_home.html',
                    controller: 'PartialsHomeCtrl'
                })

                .state('newPartialRegistration', {
                    url: '/partial-registrations/new',
                    params: {
                        hideCurrentProgram: true,
                        partial: true
                    },
                    data: {
                        pageTitle: 'New Partial Registration',
                    },
                    templateUrl: 'components/registration/registration.html',
                    controller: 'RegistrationCtrl'
                })

                .state('finishPartialRegistration', {
                    url: '/partial-registrations/{registrationId:int}',
                    params: {
                        hideCurrentProgram: true,
                        partial: false
                    },
                    data: {
                        pageTitle: 'Finish Partial Registration'
                    },
                    templateUrl: 'components/registration/registration.html',
                    controller: 'RegistrationCtrl'
                })

                .state('studentlist', {
                    url: '/studentlist',
                    params: {hideCurrentProgram: true},
                    templateUrl: 'components/studentlist/studentlist.html',
                    controller: 'StudentListCtrl'
                })

                .state('studentDetails', {
                    url: '/students/{studentId:int}',
                    params: {backToCheckinID: null, backToAttendance: null},
                    templateUrl: 'components/students/detail/view/student.detail.html',
                    controller: 'StudentDetailCtrl'
                })

                .state('attendance', {
                    url: '/attendance',
                    params: {hideCurrentProgram: true},
                    templateUrl: 'components/attendance/attendance.html',
                    controller: 'AttendanceCtrl'
                })

                .state('editStudentDetails', {
                    url: '/students/{studentId:int}/edit',
                    params: {backToCheckinID: null, viewBackToCheckinID: null, viewBackToAttendance: null},
                    templateUrl: 'components/students/detail/edit/student.edit.html',
                    controller: 'EditStudentCtrl'
                })

                .state('beltsStripes', {
                    url: '/belts-stripes',
                    templateUrl: 'components/belts-stripes/belts-stripes.html',
                    controller: 'BeltsStripesCtrl'
                })
          
                .state('userManagement', {
                    url: '/user-management',
                    templateUrl: 'components/user-management/user.management.html',
                    controller: 'manageUserCtrl'
                });

            // For any unmatched url, send to /
            $urlRouterProvider.otherwise('/');
        }]);
})();
