(function () {
    function CheckinService($http, apiHost) {

        var checkinMode = 'Checkin';

        return {
            getCheckinMode: function () {
                return checkinMode;
            },

            setCheckinMode: function (mode) {
                checkinMode = mode;
            },

            getStudentsFromProgram: function (programId) {
                return $http.get(apiHost + '/api/registrations-minimal-stripes/?program=' + programId + '&person__active=2');
            },

            getCheckinsForProgram: function (programId, checkinDate) {
                return $http.get(apiHost + '/api/check-ins/?program=' + programId +
                    '&date=' + checkinDate);
            },

            createCheckin: function (data) {
                return $http.post(apiHost + '/api/check-ins/', data);
            },

            deleteCheckin: function (checkinId) {
                return $http.delete(apiHost + '/api/check-ins/' + checkinId + '/');
            },

            getInstructorsForProgram: function (programId) {
                return $http.get(apiHost + '/api/instructors-minimal/?program=' + programId);
            },

            getInstructorCheckinsForProgram: function (programId, checkinDate) {
                return $http.get(apiHost + '/api/instructor-check-ins/?program=' + programId +
                    '&date=' + checkinDate);
            },

            createInstructorCheckin: function (data) {
                return $http.post(apiHost + '/api/instructor-check-ins/', data);
            },

            deleteInstructorCheckin: function (checkinId) {
                return $http.delete(apiHost + '/api/instructor-check-ins/' + checkinId + '/');
            },
            getStudentStripes: function (personId) {
                return $http.get(apiHost + '/api/person-stripes-detailed/?person=' + personId + '&current_stripe=2')
            }
        };
    }

    angular.module('ttkdApp')
        .factory('CheckinService', ['$http', 'apiHost', CheckinService]);
})();