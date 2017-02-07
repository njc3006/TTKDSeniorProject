(function() {
  angular.module('ttkdApp.AuthInterceptor', ['ngCookies'])
    .factory('AuthInterceptor',['$cookies', function ($cookies) {
      return {
        request: function (config) {
          if($cookies.getObject('Authorization')){
            config.headers['Authorization'] = 'Token ' + $cookies.getObject('Authorization').token;
          }
          return config;
        }
      };
    }]);
})();