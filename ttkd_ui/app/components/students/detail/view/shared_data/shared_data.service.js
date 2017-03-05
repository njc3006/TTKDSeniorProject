(function() {
  /*
   * This service exists to transfer student objects between controllers
   */
  function SharedDataService($q, StudentsSvc) {

    // defer activeStudent until a student object is present
    var activeStudent = $q.defer();

    /* function to reformat the student data object. */
    function reformatObject(object) {
      var reformatted = {};

      for (var field in object) {
        if (object.hasOwnProperty(field)) {
          var camelCased = field.replace(/[\-_\s]+(.)?/g, function(match, chr) {
            return chr ? chr.toUpperCase() : '';
          });

          camelCased = camelCased.substr(0, 1).toLowerCase() + camelCased.substr(1);

          reformatted[camelCased] = object[field];
        }
      }

      return reformatted;
    }

    return {

      /* 
       * Returns the promise to the active student get method. To use
       * the active student returned, put your functionality in a .then() after
       * the function call. */
      getActiveStudent: function() {
        return activeStudent.promise;
      },

      /*
       * Returns a promise that will fetch the student with the given id. 
       * This also sets "activeStudent" equal to that promise so that we can
       * use the same student object without making subsequent calls. */
      getStudent: function(id) {
        StudentsSvc.getStudent(id).then(
          function onSuccess(response){
            // on success reformat the student object before returning.
            response.data = reformatObject(response.data);
            response.data.emergencyContact1 = reformatObject(response.data.emergencyContact1);
            response.data.emergencyContact2 = reformatObject(response.data.emergencyContact2);
            activeStudent.resolve(response.data);
          }, function onFailure(response) {
            activeStudent.reject(response);
          });
        return activeStudent.promise;
      }

    };
  }

  angular.module('ttkdApp.studentDetailCtrl')
    .service('SharedDataSvc', [
      '$q',
      'StudentsSvc',
      SharedDataService
    ]);
})();
