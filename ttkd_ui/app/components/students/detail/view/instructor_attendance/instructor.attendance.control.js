(function() {
  function InstructorAttendanceController($scope, $http, apiHost, SharedDataService) {
    var uniquePrograms = [];
    $scope.checkedInPrograms = [];
    $scope.instructedPrograms = [];
    var studentPromise = SharedDataService.getActiveStudent();

    $scope.loadInstructedPrograms = function() {
      studentPromise.then(function(student) {
        var requestEndpoint = apiHost + '/api/instructors-minimal/?person=' + student.id;

        $http.get(requestEndpoint).then(
          function(instructionResponse) {
            instructionResponse.data.forEach(function(instruction) {
              $scope.instructedPrograms.push(instruction.program.name);
            });
          });
      });
    };

    $scope.loadCheckIns = function(programId) {
      $scope.checkIns = [];

      studentPromise.then(function(student) {
        var requestEndpoint = apiHost + '/api/instructor-check-ins-detailed/?person=' + student.id;

        if (programId !== undefined) {
          requestEndpoint += '&program=' + programId;
        }

        $http.get(requestEndpoint).then(
          function(checkinsResponse) {
            checkinsResponse.data.forEach(function(checkIn) {

              var index = uniquePrograms.indexOf(checkIn.program.id);
              if (index === -1) {
                $scope.checkedInPrograms.push(checkIn.program);
                uniquePrograms.push(checkIn.program.id);
              }
              var checkinObject = {
                id: checkIn.id,
                dateObj: moment(checkIn.date, 'YYYY-MM-DD').toDate(),
                formattedDate: moment(checkIn.date, 'YYYY-MM-DD').format('MM/DD/YYYY'),
                program: checkIn.program.name
              };
              $scope.checkIns.push(checkinObject);
            });

            // Initialize the filteredDates which will potentially be changed and
            // reset multiple times in the future, but checkIns will remain the
            // master list
            $scope.filteredDates = $scope.checkIns;
          },
          function(error) {
            // TODO: Error Handling
          }
        );
      });

    };

    $scope.onProgramChange = function() {
      $scope.loadCheckIns($scope.filterData.selectedProgram, $scope.filterData.startDate.value);
    };

    $scope.openStartCalendar = function() {
      $scope.filterData.startDate.open = true;
    };

    $scope.openEndCalendar = function() {
      $scope.filterData.endDate.open = true;
    };

    $scope.filterData = {
      startDate: {
        open: false,
        options: {
          maxDate: new Date()
        }
      },
      endDate: {
        open: false,
        options: {
          maxDate: new Date()
        }
      }
    };

    $scope.filterDates = function(start, end) {
      $scope.filteredDates = [];
      angular.forEach($scope.checkIns, function(value) {
        // Start date defin
        if (start) {
          if (end) {
            // Both start date and end date were defined
            if (value.dateObj >= start && value.dateObj <= end) {
              $scope.filteredDates.push(value);
            }
          } else {
            // Just the start date was defined
            if (value.dateObj >= start) {
              $scope.filteredDates.push(value);
            }
          }
        } else if (end) {
          // Just the end date was defined
          if (value.dateObj <= end) {
            $scope.filteredDates.push(value);
          }
        } else {
          // No filters, set to master list
          $scope.filteredDates = $scope.checkIns;
        }
      });
    };

    $scope.checkIns = [];
    $scope.enrolledPrograms = [];
    $scope.filteredDates = [];

    $scope.loadCheckIns();

    $scope.loadInstructedPrograms();

    $scope.$watch('filterData["startDate"]["value"]', function(newDate) {
      $scope.filterDates(newDate, $scope.filterData.endDate.value);
    });

    $scope.$watch('filterData["endDate"]["value"]', function(newDate) {
      $scope.filterDates($scope.filterData.startDate.value, newDate);
    });
  }

  angular.module('ttkdApp.studentDetailCtrl')
    .controller('InstructorAttendanceCtrl', [
      '$scope',
      '$http',
      'apiHost',
      'SharedDataSvc',
      InstructorAttendanceController
    ]);
})();
