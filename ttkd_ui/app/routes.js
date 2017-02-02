(function() {

  angular.module('ttkdApp.routes', ['ui.router'])

  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
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
        params: { hideCurrentProgram: true },
        templateUrl: 'components/importexport/importexport.html',
        controller: 'ImportExportCtrl'
      })

      .state('checkin', {
        url: '/checkin/{programID:int}',
        templateUrl: 'components/checkin/checkin.html',
        controller: 'CheckinCtrl',
        data: {
          pageTitle: 'Checkin'
        },
        params: {
            instructor: false
        }
      })

      .state('registration', {
        url: '/registration',
        params: { hideCurrentProgram: true },
        templateUrl: 'components/registration/registration.html',
				controller: 'RegistrationCtrl'
      })

      .state('studentlist', {
        url: '/studentlist',
        params: { hideCurrentProgram: true },
        templateUrl: 'components/studentlist/studentlist.html',
        controller: 'StudentListCtrl'
      })

			.state('studentDetails', {
				url: '/students/{studentId:int}',
				templateUrl: 'components/students/detail/view/student.detail.html',
				controller: 'StudentDetailCtrl'
			})

			.state('editStudentDetails', {
				url: '/students/{studentId:int}/edit',
				templateUrl: 'components/students/detail/edit/student.edit.html',
				controller: 'EditStudentCtrl'
			});

			// For any unmatched url, send to /
	    $urlRouterProvider.otherwise('/');
  }]);
})();
