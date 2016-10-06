(function() {

  angular.module('ttkdApp.routes', [])
  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
    // For any unmatched url, send to /
    $urlRouterProvider.otherwise('/');

    $stateProvider
      //you can set this to no template if you just want to use the html in the page
      
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
        templateUrl: 'registration/registration.html'
      });

      $urlRouterProvider.otherwise('/');

  }]);

})();
