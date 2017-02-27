(function() {
  angular.module('ttkdApp.AuthInterceptor', ['ngCookies'])
    .factory('AuthInterceptor',['$cookies', '$location', '$rootScope', '$q'
      , function ($cookies, $location, $rootScope, $q) {
      return {
        request: function (config) {
          if($cookies.getObject('Authorization')){
            config.headers['Authorization'] = 'Token ' + $cookies.getObject('Authorization').token;
          }
          return config;
        },
        responseError: function (res) {
          if(res.status === 401) {
            $location.path('/');
            if($cookies.getObject('Authorization') || $rootScope.loggedin){
              $cookies.remove('Authorization');
              $rootScope.currentUser = '';
              $rootScope.loggedin = false;
              $rootScope.currentUser = 'Anonymous';
              $rootScope.userlevel = -1;
            }
          }

          return $q.reject(res);
        },
      };
    }]);
})();
