app.controller('PerformanceController', ['$scope', '$http', '$window', function($scope, $http, $window){

  var getCriteria = function () {
      $http.get('/criteria').success(function(response) {
        //update table
        $scope.criteria = response;
      });
  }

  var getAlternatives = function () {
      $http.get('/actions').success(function(response) {
        //update table
        $scope.actions = response;
      });
  }

  var getPerformanceValues = function() {
    $http.get('/performancetable').success(function(response) {
      $scope.performanceValues = response;

      //If there are any stored values in the database, put them on the table
      if($scope.performanceValues.length > 0) {
        for(var i = 0; i < $scope.performanceValues.length; i++) {
          var dbId = $scope.performanceValues[i]['action'] + '/' + $scope.performanceValues[i]['criterion'];
          $('input').each(function() {
            $this = $(this);
            var id = $this.attr('id');
            if(id == dbId)
              $this.val($scope.performanceValues[i]['value']);
          });
        }
      }
    });
  }

  var refreshPerformance = function() {
    getCriteria();
    getAlternatives();
    getPerformanceValues();
  }

  refreshPerformance();

  $scope.submitValues = function() {
    //delete previous values
    $http.delete('/performancetable').success(function(response) {
      $('input.valueInput').each(function() {
        $this = $(this);
        var id = $this.attr('id');

        //find the value's corresponding alternative and criterion based on its id
        var slash = id.indexOf('/');
        var action = id.substr(0, slash);
        var criterion = id.substr(slash + 1);
        var value = $this.val();
        var text = '{"action":"' + action + '", "criterion":"' + criterion + '", "value":"' + value + '"}';
        var obj = JSON.parse(text);

        //store json on database
        $http.post('/performancetable', obj).success(function(response) {
        });
      });
    });
  }

  $scope.addAction = function() {
    //store criterion on db
    $http.post('/actions', $scope.action).success(function(response) {
      //clear input field
      $scope.action.name = '';
      //show criterion in list in html
      refreshPerformance();
    });
  }

  $scope.deleteAction = function(id) {
    //remove criterion from db
    $http.delete('/actions/' + id).success(function(response) {
      //remove criterion from list in html
      refreshPerformance();
    });
  }

  $scope.nextStep = function() {
    $window.location.href = 'Categories.html';
  }
}]);
