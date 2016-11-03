app.controller('CredibilityController', ['$scope', '$http', function($scope, $http) {

  $scope.existsDB = 0;

  var getCredibilityLevel = function() {
    $http.get('/credibility').success(function(response) {
      if(response.length > 0) {
        $scope.credibility = response[0];
        $scope.existsDB = 1;
      }
    });
  }

  getCredibilityLevel();

  $scope.submitCredibility = function() {
    if($scope.existsDB == 0)
      $http.post('/credibility', $scope.credibility).success(function(response) {
        $scope.credibility = response;
      });
    else
      $http.put('/credibility/' + $scope.credibility._id, $scope.credibility).success(function(response) {
        $scope.credibility = response;
      });
  }

}]);
