(function() {

  angular.module('ttkdApp.routes', ['ui.router'])

  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // For any unmatched url, send to /
    $urlRouterProvider.otherwise('/');

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
        url: '/checkin',
        templateUrl: 'components/checkin/checkin.html',
        controller: 'CheckinCtrl',
        data: {
          pageTitle: 'Checkin'
        }
      })

      .state('registration', {
        url: '/registration',
        templateUrl: 'registration/registration.html',
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

      $urlRouterProvider.otherwise('/');

  }]);

})();
