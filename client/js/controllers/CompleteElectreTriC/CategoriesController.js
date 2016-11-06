app.controller('CategoriesController', ['$scope', '$http', '$window', function($scope, $http, $window){

  function refreshCategories() {
      $http.get('/CompleteCategories').success(function(response) {
        //update table
        $scope.categories = response;

        //currentRankings must be +1 than nextRankings
        var nextRankings = $scope.categories.length;
        var currentRankings = $('select').children().length;
        var lastOption = $('select').children().last().val();
        var difference = currentRankings - nextRankings;

        if(difference <  1)
          for(var i = difference; i < 1; i++) {
            lastOption++;
            $('select').append('<option value = ' + lastOption + '>' + lastOption + '</option>');
          }
        else if(difference > 1)
          for(var i = difference; i > 1; i--)
            $('select').children().last().remove();
    });
  }

  refreshCategories();

  $scope.addCategory = function() {
    if(($scope.category.name).length) {
      $scope.category.ranking = $('select').val();

      //check if there is another category with this ranking already
      var rankingFlag = 0;
      for(var i = 0; i < $scope.categories.length; i++)
        if($scope.category.ranking == $scope.categories[i]['ranking']) {
          rankingFlag = 1;
          break;
        }

      if(rankingFlag)
        alert('Category with ranking ' + $scope.category.ranking + ' already exists.');
      else {
        //store criterion on db
        $http.post('/CompleteCategories', $scope.category).success(function(response) {
          //clear input fields
          $scope.category.name = '';
          $scope.category.referenceAction = '';

          //show criterion in list in html
          refreshCategories();
        });
      }
    }
  }

  $scope.deleteCategory = function(id) {
    //remove criterion from db
    $http.delete('/CompleteCategories/' + id).success(function(response) {
      //remove criterion from list in html
      refreshCategories();
    });
  }

  //Check if all the rankings are attributed
  $scope.checkRankings = function() {
    var maxRanking = 0;
    for(var i = 0; i < $scope.categories.length; i++)
      if($scope.categories[i]['ranking'] > maxRanking)
        maxRanking = $scope.categories[i]['ranking'];

    if(maxRanking > $scope.categories.length)
      alert('Please attribute all rankings.');
    else
      $window.location.href = 'ProfilesPerformance.html';
  }

  $scope.submitRankings = function() {
    $scope.checkRankings();
  }

}]);
