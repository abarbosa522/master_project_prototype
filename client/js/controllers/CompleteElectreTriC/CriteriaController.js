app.controller('CriteriaController', ['$scope', '$http', '$window', function($scope, $http, $window) {

  var refreshCriteria = function () {
      $http.get('/CompleteCriteria').success(function(response) {
        //update table
        $scope.criteria = response;
      })
  }

  refreshCriteria();

  $scope.addCriterion = function() {
    if(($scope.criterion.name).length) {
      //define the diredction
      $scope.criterion.direction = $('select').val();

      //store criterion on db
      $http.post('/CompleteCriteria', $scope.criterion).success(function(response) {
        //clear input field
        $scope.criterion.name = '';
        $scope.criterion.weight = '';
        $scope.criterion.indifference = '';
        $scope.criterion.preference = '';
        $scope.criterion.veto = '';

        //show criterion in list in html
        refreshCriteria();
      });
    }
  }

  $scope.deleteCriterion = function(id) {
    //remove criterion from db
    $http.delete('/CompleteCriteria/' + id).success(function(response) {
      //remove criterion from list in html
      refreshCriteria();
    });
  }

  $scope.checkWeights = function() {
      var sumWeights = 0;
      for(var i = 0; i < $scope.criteria.length; i ++)
        sumWeights += $scope.criteria[i]['weight'];

      if(sumWeights != 1)
        alert('The sum of all weights must be 1. It currently is ' + sumWeights);
      else
        $window.location.href = 'ActionsPerformance.html';
  }
}]);
