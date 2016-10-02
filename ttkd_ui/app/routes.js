(function() {

  angular.module('ttkdApp.routes', ['ttkdApp', 'ui.router'])

  .config(function($stateProvider, $urlRouterProvider) {
    // For any unmatched url, send to /
    $urlRouterProvider.otherwise('/');

    $stateProvider
      //you can set this to no template if you just want to use the html in the page
      
      .state('home', {
        url: '/',
        templateUrl: 'home/home.html',
        data: {
          pageTitle: 'Home'
        }
      });

      .state('checkin', {
        url: '/checkin',
        templateUrl: 'components/checkin.html',
        controller: 'StudentCheckinCtrl'
        data: {
          pageTitle: 'Home'
        }
      });

      $urlRouterProvider.otherwise('/');

  });

})();
