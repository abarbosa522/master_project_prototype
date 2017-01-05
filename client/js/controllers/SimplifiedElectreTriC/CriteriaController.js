app.controller('CriteriaController', ['$scope', '$http', '$window', function($scope, $http, $window){

  var refreshCriteria = function () {
      $http.get('/criteria').success(function(response) {
        //update table
        $scope.criteria = response;
        sumWeights();
      })
  }

  refreshCriteria();

  $scope.addCriterion = function() {
    if(($scope.criterion.name).length) {
      //define the diredction
      $scope.criterion.direction = $('select').val();

      //store criterion on db
      $http.post('/criteria', $scope.criterion).success(function(response) {
        //clear input field
        $scope.criterion.name = '';
        $scope.criterion.weight = '';

        //show criterion in list in html
        refreshCriteria();

        //refresh the total sum of the weights
        sumWeights();
      });
    }
  }

  $scope.deleteCriterion = function(id) {
    //remove criterion from db
    $http.delete('/criteria/' + id).success(function(response) {
      //remove criterion from list in html
      refreshCriteria();
    });
  }

  $scope.checkWeights = function() {
      var sumWeight = sumWeights();

      if(sumWeight != 1)
        alert('The sum of all weights must be 1. It currently is ' + sumWeight);
      else
        $window.location.href = 'ActionsPerformance.html';
  }

  function sumWeights() {
    var sumWeights = 0;

    for(var i = 0; i < $scope.criteria.length; i++)
      sumWeights += $scope.criteria[i]['weight'];

    $scope.sumWeights = sumWeights;
    return sumWeights;
  }
}]);
