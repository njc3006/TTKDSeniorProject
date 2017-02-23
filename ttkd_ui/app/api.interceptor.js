(function() {
  angular.module('ttkdApp.AuthInterceptor', ['ngCookies'])
    .factory('AuthInterceptor',['$cookies', '$location', '$q', function ($cookies, $location, $q) {
      return {
        request: function (config) {
          if($cookies.getObject('Authorization')){
            config.headers['Authorization'] = 'Token ' + $cookies.getObject('Authorization').token;
          }
          return config;
        },
        responseError: function (res) {
          if (res.status === 403) {
            $location.path('/');
          }

          return $q.reject(res);
        },
      };
    }]);
})();
