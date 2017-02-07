(function() {
  function APIService($http, apiHost, $cookies) {
    return {
      queryAPI: function(apiAddress, callType, data) {
        $http.defaults.headers.post.Authorization =   $cookies.getObject('Authorization').token;

        if (callType === 'GET') {
          return $http.get(apiAddress);
        }
        else if (callType === 'PUT' && data) {
          return $http.put(apiAddress, data);
        }
        else if (callType === 'POST' && data) {
          return $http.post(apiAddress, data);
        }
      }
    };
  }

  //angular.module('ttkdApp')
  //  .factory('APIService', ['$http', 'apiHost', '$cookies', APIService]);
})();
