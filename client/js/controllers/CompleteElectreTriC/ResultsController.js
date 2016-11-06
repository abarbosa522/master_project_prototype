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

  function binaryRelations(totalActions, criteria) {
    for(var i = 0; i < totalActions.length; i++) {
      var criterion = totalActions[i]['criterion'];
      var action1 = totalActions[i]['action'];
      var value1 = Number(totalActions[i]['value']);
      var indifference, preference;

      //store the thresholds for the criterion
      for(var k = 0; k < criteria.length; k++)
        if(criteria[k]['name'] == criterion) {
          indifference = criteria[k]['indifference'];
          preference = criteria[k]['preference'];
        }

      for(var j = 0; j < totalActions.length; j++) {
        var action2 = totalActions[j]['action'];
        if(totalActions[j]['criterion'] == criterion && action2 != action1 && j != i) {
          var value2 = Number(totalActions[j]['value']);

          if(Math.abs(value1 - value2) <= indifference)
            actionRelations.push(criterion + ': ' + action1 + ' I ' + action2);
          else if(value1 - value2 > preference)
            actionRelations.push(criterion + ': ' + action1 + ' P ' + action2);
          else if(indifference < value1 - value2 && value1 - value2 <= preference)
            actionRelations.push(criterion + ': ' + action1 + ' Q ' + action2);
        }
      }
    }
  }

  function concordanceIndex(action1, action2, criteria, totalActions) {
    var sum1 = 0, sum2 = 0;
    var actionString1 = action1 + ' P ' + action2;
    var actionString2 = action1 + ' Q ' + action2;
    var actionString3 = action1 + ' I ' + action2;
    var actionString4 = action2 + ' Q ' + action1;

    for(var i = 0; i < actionRelations.length; i++) {
      if(actionRelations[i].indexOf(actionString1) != -1 || actionRelations[i].indexOf(actionString2) != -1 ||actionRelations[i].indexOf(actionString3) != -1) {
        var criteriaName = actionRelations[i].substr(0, actionRelations[i].indexOf(':'));
        for(var j = 0; j < criteria.length; j++)
          if(criteria[j]['name'] == criteriaName)
            sum1 += Number(criteria[j]['weight']);
      }
      else if(actionRelations[i].indexOf(actionString4) != -1) {
        var criteriaName = actionRelations[i].substr(0, actionRelations[i].indexOf(':'));
        for(var j = 0; j < criteria.length; j++)
          if(criteria[j]['name'] == criteriaName)
            sum2 += Number(criteria[j]['weight']) * concordance_aux(action1, action2, criteria[j], totalActions);
      }
    }
    return sum1 + sum2;
  }

  function concordance_aux(action1, action2, criterion, totalActions) {
    var value1, value2;
    var preference = Number(criterion['preference']);
    var indifference = Number(criterion['indifference']);

    for(var i = 0; i < totalActions.length; i++) {
      if(totalActions[i]['criterion'] == criterion['name'] && totalActions[i]['action'] == action1)
        value1 = Number(totalActions[i]['value']);
      else if (totalActions[i]['criterion'] == criterion['name'] && totalActions[i]['action'] == action2)
        value2 = Number(totalActions[i]['value']);
    }

    return (preference - (value2 - value1)) / (preference - indifference);
  }

  function discordanceIndex(action1, action2, criterion, totalActions) {
    var value1, value2;
    var preference = Number(criterion['preference']);
    var veto = Number(criterion['veto']);

    for(var i = 0; i < totalActions.length; i++) {
      if(totalActions[i]['criterion'] == criterion['name'] && totalActions[i]['action'] == action1)
        value1 = Number(totalActions[i]['value']);
      else if (totalActions[i]['criterion'] == criterion['name'] && totalActions[i]['action'] == action2)
        value2 = Number(totalActions[i]['value']);
    }
    
    if(value1 - value2 < -veto)
      return 1;
    else if(-veto <= value1 - value2 && value1 - value2 <= -preference)
      return (value1 - value2 + preference) / (preference - veto);
    else if(value1 - value2 >= -preference)
      return 0;
  }

  function credibilityIndex(action1, action2, criteria, totalActions) {
    var concordance = concordanceIndex(action1, action2, criteria, totalActions);
    var totalMult = concordance;

    for(i = 0; i < criteria.length; i++)
      totalMult *= credibility_aux(action1, action2, criteria[i], totalActions, concordance);

    return totalMult;
  }

  function credibility_aux(action1, action2, criterion, totalActions, concordance) {
    var discordance = discordanceIndex(action1, action2, criterion, totalActions);

    if(discordance > concordance)
      return (1 - discordance)/(1 - concordance);
    else
      return 1;
  }

  function minFunction(action1, action2, criteria, totalActions) {
    return Math.min(credibilityIndex(action1, action2, criteria, totalActions), credibilityIndex(action2, action1, criteria, totalActions));
  }

  function ascendingRule(criteria, credibility, categories, actions, totalActions) {
    for(var i = 0; i < actions.length; i++) {
      for(var h = 0; h < categories.length; h++) {
        if(credibilityIndex(categories[h]['referenceAction'], actions[i]['name'], criteria, totalActions) >= credibility)
          break;
      }

      if(h == 1)
        maxCategories.push(categories[h]['name']);
      else if(h > 1 && h < categories.length - 1) {
        if(minFunction(actions[i]['name'], categories[h]['referenceAction'], criteria, totalActions) > minFunction(actions[i]['name'], categories[h - 1]['referenceAction'], criteria, totalActions))
          maxCategories.push(categories[h]['name']);
        else
          maxCategories.push(categories[h - 1]['name']);
      }
      else if(h == categories.length - 1)
        maxCategories.push(categories[categories.length - 2]['name']);
    }
  }

  function descendingRule(criteria, credibility, categories, actions, totalActions) {
    for(var i = 0; i < actions.length; i++) {
      for(var h = categories.length - 2; h >= 0; h--)
        if(credibilityIndex(actions[i]['name'], categories[h]['referenceAction'], criteria, totalActions) >= credibility)
          break;

      //the best and worst categories can't be chosen
      if(h == categories.length - 2)
        minCategories.push(categories[h]['name']); //chooses the second best category
      else if(h > 0 && h < categories.length - 2) {
        if(minFunction(actions[i]['name'], categories[h]['referenceAction'], criteria, totalActions) > minFunction(actions[i]['name'], categories[h + 1]['referenceAction'], criteria, totalActions))
          minCategories.push(categories[h]['name']);
        else
          minCategories.push(categories[h + 1]['name']);
      }
      else if(h == 0)
        minCategories.push(categories[1]['name']); //chooses the second worst category
    }
  }

  function getResults() {
    $http.get('/CompleteActionsPerformance').success(function(response1) {
      var performancetable = response1;

      $http.get('/CompleteProfilesPerformance').success(function(response2) {
        var profileperformance = response2;

        $http.get('/CompleteCriteria').success(function(response3) {
          var criteria = response3;

          $http.get('/CompleteCredibility').success(function(response4) {
            var credibility = response4[0]['value'];

            $http.get('/CompleteCategories').success(function(response5) {
              var categories = response5;

              $http.get('/CompleteActions').success(function(response6) {
                var actions = response6;

                var totalActions = addOtherCategories(categories, criteria, profileperformance, performancetable);
                binaryRelations(totalActions, criteria);
                ascendingRule(criteria, credibility, categories, actions, totalActions);
                descendingRule(criteria, credibility, categories, actions, totalActions);

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
