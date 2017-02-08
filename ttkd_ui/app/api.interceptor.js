(function() {
  angular.module('ttkdApp.AuthInterceptor', ['ngCookies'])
    .factory('AuthInterceptor',['$cookies', '$location', function ($cookies, $location) {
      return {
        request: function (config) {
          if($cookies.getObject('Authorization')){
            config.headers['Authorization'] = 'Token ' + $cookies.getObject('Authorization').token;
          }
          return config;
        },
        responseError: function (res) {
          //console.log(res);
          $location.path('/');
          return res;
        },
      };
    }]);
})();