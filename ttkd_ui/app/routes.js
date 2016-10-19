(function() {

  angular.module('ttkdApp.routes', ['ui.router'])

  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
<<<<<<< 17191a45ea9bb8fd8012c6a9152f000722584645

      //you can set this to no template if you just want to use the html in the page

=======
      //you can set this to no template if you just want to use the html in the page
>>>>>>> begin fleshing out page
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

      .state('classlist', {
        url: '/classlist/{classId:int}',
        templateUrl: 'components/classlist/classlist.html',
        controller: 'ClassListCtrl'
      })

      .state('studentlist', {
        url: '/studentlist',
        templateUrl: 'components/classlist/classlist.html',
        controller: 'ClassListCtrl'
      });

			.state('studentDetails', {
				url: '/students/{studentId}',
				templateUrl: 'components/students/detail/student.detail.html',
				controller: 'StudentDetailCtrl'
			});

			// For any unmatched url, send to /
	    $urlRouterProvider.otherwise('/');
  }]);
})();
