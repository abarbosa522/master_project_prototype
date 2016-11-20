app.controller('ActionsPerformanceController', ['$scope', '$http', '$window', function($scope, $http, $window){

  //ids of every object stored in the performance values db, so that they can then be deleted
  var ids = [];

  var getCriteria = function () {
      $http.get('/criteria').success(function(response) {
        //update table
        $scope.criteria = response;
      });
  }

  var getActions = function () {
      $http.get('/actions').success(function(response) {
        //update table
        $scope.actions = response;
      });
  }

  var getPerformanceValues = function() {
    $http.get('/performancetable').success(function(response) {
      $scope.performanceValues = response;

      for(var i = 0; i < $scope.performanceValues.length; i++) {
        var id = $scope.performanceValues[i]['action'] + '/' + $scope.performanceValues[i]['criterion'];
        angular.element(document.getElementById(id)).append($scope.performanceValues[i]['value']);
        ids.push($scope.performanceValues[i]['action'] + '/' + $scope.performanceValues[i]['_id']);
      }
    });
  }

  var refreshPerformance = function() {
    getCriteria();
    getActions();
    getPerformanceValues();
  }

  refreshPerformance();

  $scope.addAction = function() {
    //store action on db
    $http.post('/actions', $scope.action).success(function(response) {

      //search all the input fields
      $('input.valueInput').each(function() {
        $this = $(this);
        var criterion = $this.attr('id');
        var value = $this.val();
        var text = '{"action":"' + $scope.action.name + '", "criterion":"' + criterion + '", "value":"' + value + '"}';
        var obj = JSON.parse(text);

        //store json on database
        $http.post('/performancetable', obj).success(function(response) {
          //clear input field
          $scope.action.name = '';
        });
      });

      refreshPerformance();
    });
  }

  $scope.deleteAction = function(name, id) {
    //remove action from db
    $http.delete('/actions/' + id).success(function(response) {
      //remove the actions' performance values from db
      for(var i = 0; i < ids.length; i++) {
        var indexSlash = ids[i].indexOf('/');
        var idName = ids[i].substr(0, indexSlash);
        if(idName == name) {
          var idValue = ids[i].substr(indexSlash + 1);
          $http.delete('/performancetable/' + idValue).success(function(response) {
          });
        }
      }

      refreshPerformance();
    });
  }

  $scope.nextStep = function() {
    $window.location.href = 'Categories.html';
  }
}]);
