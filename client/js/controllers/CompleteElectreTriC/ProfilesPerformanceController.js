app.controller('ProfilesPerformanceController', ['$scope', '$http', '$window', function($scope, $http, $window) {

  var getCriteria = function () {
      $http.get('/CompleteCriteria').success(function(response) {
        //update table
        $scope.criteria = response;
      });
  }

  var getActions = function() {
    $http.get('/CompleteCategories').success(function(response) {
      $scope.actions = response;
    });
  }

  var getPerformanceValues = function() {
    $http.get('/CompleteProfilesPerformance').success(function(response) {
      $scope.profilePerformanceValues = response;

      //If there are any stored values in the database, put them on the table
      if($scope.profilePerformanceValues.length > 0) {
        for(var i = 0; i < $scope.profilePerformanceValues.length; i++) {
          var dbId = $scope.profilePerformanceValues[i]['action'] + '/' + $scope.profilePerformanceValues[i]['criterion'];
          $('input').each(function() {
            $this = $(this);
            var id = $this.attr('id');
            if(id == dbId)
              $this.val($scope.profilePerformanceValues[i]['value']);
          });
        }
      }
    });
  }

  getCriteria();
  getActions();
  getPerformanceValues();

  $scope.submitValues = function() {
    $http.delete('/CompleteProfilesPerformance').success(function(response) {
      $http.get('/CompleteCriteria').success(function(response) {
        var criteria = response;

        //create and initialize dictionary to store maximum values
        var dict = {};

        for(var i = 0; i < criteria.length; i++)
          dict[criteria[i]['name']] = 0;

        $('input').each(function() {
          $this = $(this);
          var id = $this.attr('id');

          if(id != 'credibilityInput') {
            //find the value's corresponding action and criterion based on its id
            var slash = id.indexOf('/');
            var action = id.substr(0, slash);
            var criterion = id.substr(slash + 1);
            var value = $this.val();
            var text = '{"action":"' + action + '", "criterion":"' + criterion + '", "value":"' + value + '"}';
            var obj = JSON.parse(text);

            //update dictionary with the maximum value
            if(Number(value) > dict[criterion])
              dict[criterion] = Number(value) + 1;

            //store json on database
            $http.post('/CompleteProfilesPerformance', obj).success(function(response) {
            });
          }
        });
      });
    });
  }

  $scope.clearTable = function() {
    $http.delete('/profileperformance').success(function(response) {
      $('input').each(function() {
        if($(this).attr('id') != 'credibilityInput')
          $(this).val(0);
      });
    });
  }

  $scope.nextStep = function() {
    $window.location.href = 'Results.html';
  }
}]);
