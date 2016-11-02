(function() {

  angular.module('ttkdApp.routes', ['ui.router'])

  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'home/home.html',
        controller: 'HomeCtrl',
        data: {
          pageTitle: 'Home'
        }
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
        templateUrl: 'components/registration/registration.html',
				controller: 'RegistrationCtrl'
      })

      .state('studentlist', {
        url: '/studentlist',
        templateUrl: 'components/studentlist/studentlist.html',
        controller: 'StudentListCtrl'
      })

			.state('studentDetails', {
				url: '/students/{studentId}',
				templateUrl: 'components/students/detail/student.detail.html',
				controller: 'StudentDetailCtrl'
			});

			// For any unmatched url, send to /
	    $urlRouterProvider.otherwise('/');
  }]);
})();
