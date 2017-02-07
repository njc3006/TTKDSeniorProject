(function() {
  angular.module('ttkdApp.APIInterceptor', ['ngCookies'])
  .service('APIInterceptor', ['$cookies', function($cookies) {
    var service = this;

    service.request = function(config) {
      if($cookies.getObject('Authorization')) {
        config.headers.Authorization = 'Token ' + $cookies.getObject('Authorization').token;
      }
      return config;
    };
  }]);
})();