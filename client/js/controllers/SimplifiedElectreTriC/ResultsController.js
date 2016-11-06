app.controller('ResultsController', ['$scope', '$http', function($scope, $http) {
  var actionRelations = [];
  var minCategories = [];
  var maxCategories = [];
  $scope.results = [];

  function addOtherCategories(categories, criteria, profileperformance, performancetable) {
    //add best action to categories
    var str1 = '{ "name":"Best", "referenceAction":"best", "ranking":"0" }';
    var obj1 = JSON.parse(str1);
    categories.push(obj1);

    //add worst action to categories
    var str2 = '{ "name":"Worst", "referenceAction":"worst", "ranking":"' + categories.length + '" }';
    var obj2 = JSON.parse(str2);
    categories.push(obj2);

    //sort categories from best to worst
    categories.sort(function(a, b) {
      return parseFloat(b.ranking) - parseFloat(a.ranking);
    });

    //add worst profile performance values
    for(var i = 0; i < criteria.length; i++) {
      var str3 = '{"action":"worst", "criterion":"' + criteria[i]['name'] + '", "value":"' + 0 + '"}';
      var obj3 = JSON.parse(str3);
      profileperformance.push(obj3);
    }

    //add best profile performance values
    var dict = {};

    for(var i = 0; i < criteria.length; i++)
      dict[criteria[i]['name']] = 0;

    var totalActions = performancetable.concat(profileperformance);

    for(var i = 0; i < totalActions.length; i++)
      if(totalActions[i]['value'] > dict[totalActions[i]['criterion']])
        dict[totalActions[i]['criterion']] = Number(totalActions[i]['value']) + 1;

    for(act in dict) {
      var str4 = '{"action":"best", "criterion":"' + act + '", "value":"' + dict[act] + '"}';
      var obj4 = JSON.parse(str4);
      totalActions.push(obj4);
    }
    return totalActions;
  }

  function binaryRelations(totalActions) {
    for(var i = 0; i < totalActions.length; i++) {
      var criterion = totalActions[i]['criterion'];
      var action1 = totalActions[i]['action'];
      var value1 = Number(totalActions[i]['value']);
      for(var j = i + 1; j < totalActions.length; j++) {
        var action2 = totalActions[j]['action'];
        if(totalActions[j]['criterion'] == criterion && action2 != action1) {
          var value2 = Number(totalActions[j]['value']);
          if(value1 > value2)
            actionRelations.push(criterion + ': ' + action1 + ' P ' + action2);
          else if(value1 < value2)
            actionRelations.push(criterion + ': ' + action2 + ' P ' + action1);
          else if(value1 == value2)
            actionRelations.push(criterion + ': ' + action1 + ' I ' + action2);
        }
      }
    }
  }

  function concordanceIndex(action1, action2, criteria) {
    var totalSum = 0;
    var actionString1 = action1 + ' P ' + action2;
    var actionString2 = action1 + ' I ' + action2;

    for(var i = 0; i < actionRelations.length; i++) {
      if(actionRelations[i].indexOf(actionString1) != -1 || actionRelations[i].indexOf(actionString2) != -1) {
        var criteriaName = actionRelations[i].substr(0, actionRelations[i].indexOf(':'));
        for(var j = 0; j < criteria.length; j++)
          if(criteria[j]['name'] == criteriaName)
            totalSum += Number(criteria[j]['weight']);
      }
    }
    return totalSum;
  }

  function minFunction(action1, action2, criteria) {
    return Math.min(concordanceIndex(action1, action2, criteria), concordanceIndex(action2, action1, criteria));
  }

  function ascendingRule(criteria, credibility, categories, actions) {
    for(var i = 0; i < actions.length; i++) {
      for(var h = 0; h < categories.length; h++) {
        if(concordanceIndex(categories[h]['referenceAction'], actions[i]['name'], criteria) >= credibility)
          break;
      }

      if(h == 1)
        maxCategories.push(categories[h]['name']);
      else if(h > 1 && h < categories.length - 1) {
        if(minFunction(actions[i]['name'], categories[h]['referenceAction'], criteria) > minFunction(actions[i]['name'], categories[h - 1]['referenceAction'], criteria))
          maxCategories.push(categories[h]['name']);
        else
          maxCategories.push(categories[h - 1]['name']);
      }
      else if(h == categories.length - 1)
        maxCategories.push(categories[categories.length - 2]['name']);
    }
  }

  function descendingRule(criteria, credibility, categories, actions) {
    for(var i = 0; i < actions.length; i++) {
      for(var h = categories.length - 2; h >= 0; h--)
        if(concordanceIndex(actions[i]['name'], categories[h]['referenceAction'], criteria) >= credibility)
          break;

      //the best and worst categories can't be chosen
      if(h == categories.length - 2)
        minCategories.push(categories[h]['name']); //chooses the second best category
      else if(h > 0 && h < categories.length - 2) {
        if(minFunction(actions[i]['name'], categories[h]['referenceAction'], criteria) > minFunction(actions[i]['name'], categories[h + 1]['referenceAction'], criteria))
          minCategories.push(categories[h]['name']);
        else
          minCategories.push(categories[h + 1]['name']);
      }
      else if(h == 0)
        minCategories.push(categories[1]['name']); //chooses the second worst category
    }
  }

  function getResults() {
    $http.get('/performancetable').success(function(response1) {
      var performancetable = response1;

      $http.get('/profileperformance').success(function(response2) {
        var profileperformance = response2;

        $http.get('/criteria').success(function(response3) {
          var criteria = response3;

          $http.get('/credibility').success(function(response4) {
            var credibility = response4[0]['value'];

            $http.get('/categories').success(function(response5) {
              var categories = response5;

              $http.get('/actions').success(function(response6) {
                var actions = response6;

                var totalActions = addOtherCategories(categories, criteria, profileperformance, performancetable);
                binaryRelations(totalActions);

                ascendingRule(criteria, credibility, categories, actions);
                descendingRule(criteria, credibility, categories, actions);

                for(var i = 0; i < actions.length; i++)
                  $scope.results.push(JSON.parse('{ "name":"' + actions[i]['name'] + '", "min":"' + minCategories[i] + '", "max":"' + maxCategories[i] + '"}'));
              });
            });
          });
        });
      });
    });
  }

  getResults();
}]);
