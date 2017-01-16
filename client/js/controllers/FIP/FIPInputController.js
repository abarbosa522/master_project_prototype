app.controller('FIPInputController', ['$scope', '$http', '$window', function($scope, $http, $window) {

  //store the new criterion name and values
  $scope.models = {};
  //store the new typical action name and values
  $scope.typical_actions_models = {};
  $scope.categories_models = {};

  //store the document ids of the criteria
  var criteria_ids = {};
  //store the document ids of the actions
  var actions_ids = {};
  var typical_actions_ids = {};
  var categories_ids = {};

  function refreshCriteria() {
    $http.get('/FIPScoringTable').success(function(response) {
      //update table
      $scope.criteria = response;

      for(criterion in response)
        criteria_ids[response[criterion].name] = response[criterion]._id;
    });
  }

  function refreshActions() {
    $http.get('/FIPActions').success(function(response) {
      //update table
      $scope.actions = response;

      for(action in response)
        actions_ids[response[action].name] = response[action]._id;

    });
  }

  function refreshTypicalActions() {
    $http.get('/FIPTypicalActions').success(function(response) {
      //update table
      $scope.typical_actions = response;

      for(typical_action in response)
        typical_actions_ids[response[typical_action].name] = response[typical_action]._id;
    });
  }

  function refreshCategories() {
    $http.get('/FIPCategories').success(function(response) {
      //update table
      $scope.categories = response;

      for(category in response)
        categories_ids[response[category].name] = response[category]._id;
    });
  }

  $scope.addCriterion = function() {
    var criterionText = '{"name":"' + $scope.new_criterion.name + '","actions":[{';

    for(model in $scope.models)
      criterionText += '"' + model + '":"' + $scope.models[model] + '",';

    if(criterionText[criterionText.length - 1] == ',')
      criterionText = criterionText.substring(0, criterionText.length - 1);

    criterionText += '}]}';

    var new_criterion = JSON.parse(criterionText);

    $http.post('/FIPScoringTable', new_criterion).success(function(response) {
      //clear input field
      $scope.new_criterion = '';
      $scope.models = {};

      refreshCriteria();
    });
  }

  $scope.addAction = function() {
    $http.post('/FIPActions', $scope.new_action).success(function(response) {
      //clear input field
      $scope.new_action = '';

      refreshActions();
    });
  }

  $scope.addTypicalAction = function() {
    var actionText = '{"name":"' + $scope.new_typical_action.name + '","actions":[{';

    for(model in $scope.typical_actions_models)
      actionText += '"' + model + '":"' + $scope.typical_actions_models[model] + '",';

    if(actionText[actionText.length - 1] == ',')
      actionText = actionText.substring(0, actionText.length - 1);

    actionText += '}]}';

    var new_action = JSON.parse(actionText);

    $http.post('/FIPTypicalActions', new_action).success(function(response) {
      //clear input field
      $scope.new_typical_action = '';
      $scope.typical_actions_models = {};

      refreshTypicalActions();
    });
  }

  $scope.addCategory = function() {
    console.log($scope.categories_models);
    var categoryText = '{"name":"' + $scope.new_category.name + '","typical_actions":[{';

    for(model in $scope.categories_models)
      categoryText += '"' + model + '":"' + $scope.categories_models[model] + '",';

    if(categoryText[categoryText.length - 1] == ',')
      categoryText = categoryText.substring(0, categoryText.length - 1);

    categoryText += '}]}';

    var new_category = JSON.parse(categoryText);

    $http.post('/FIPCategories', new_category).success(function(response) {
      //clear input field
      $scope.new_category = '';
      $scope.categories_models = {};

      refreshCategories();
    });
  }

  $scope.deleteCriterion = function(criterion_name) {
    $http.delete('/FIPScoringTable/' + criteria_ids[criterion_name]).success(function(response) {
      refreshCriteria();
    });
  }

  $scope.deleteAction = function(action_name) {
    $http.delete('/FIPActions/' + actions_ids[action_name]).success(function(response) {
      refreshActions();
    });
  }

  $scope.deleteTypicalAction = function(typical_action_name) {
    $http.delete('/FIPTypicalActions/' + typical_actions_ids[typical_action_name]).success(function(response) {
      refreshTypicalActions();
    });
  }

  $scope.deleteCategory = function(category_name) {
    $http.delete('/FIPCategories/' + categories_ids[category_name]).success(function(response) {
      refreshCategories();
    });
  }
  refreshCriteria();
  refreshActions();
  refreshTypicalActions();
  refreshCategories();
}]);
