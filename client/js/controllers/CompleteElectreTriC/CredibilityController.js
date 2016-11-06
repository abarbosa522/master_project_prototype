app.controller('CredibilityController', ['$scope', '$http', function($scope, $http) {

  $scope.existsDB = 0;

  var getCredibilityLevel = function() {
    $http.get('/CompleteCredibility').success(function(response) {
      if(response.length > 0) {
        $scope.credibility = response[0];
        $scope.existsDB = 1;
      }
    });
  }

  getCredibilityLevel();

  $scope.submitCredibility = function() {
    if($scope.existsDB == 0)
      $http.post('/CompleteCredibility', $scope.credibility).success(function(response) {
        $scope.credibility = response;
      });
    else
      $http.put('/CompleteCredibility/' + $scope.credibility._id, $scope.credibility).success(function(response) {
        $scope.credibility = response;
      });
  }

}]);
