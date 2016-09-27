(function() {

  angular.module('app.routes', ['app', 'ui.router'])

  .config(function($stateProvider, $urlRouterProvider) {
    // For any unmatched url, send to /
    $urlRouterProvider.otherwise('/');

    $stateProvider
      // you can set this to no template if you just want to use the html in the page
      // .state('home', {
      //   url: '/',
      //   templateUrl: 'home.html',
      //   data: {
      //     pageTitle: 'Home'
      //   }
      // });

  });

})();
