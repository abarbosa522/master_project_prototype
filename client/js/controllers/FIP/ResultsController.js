app.controller('ResultsController', ['$scope', '$http', '$window', function($scope, $http, $window) {
  //user input data
  var criteria, actions, typical_actions, categories, cutting_threshold, all_actions;

  //merge two different dictionaries
  function extend(obj, src) {
    for(key in obj) {
      src[src.length] = obj[key];
    }
    return src;
  }

  function outrankingRelations(criterion, action_a, action_b) {
    //name of the criterion
    var criterion_name = criteria[criterion]['name'];
    //preference threshold (pj) of criterion
    var criterion_preference = Number(criteria[criterion]['parameters'][0]['preference']);
    //indifference threshold (qj) of criterion
    var criterion_indifference = Number(criteria[criterion]['parameters'][0]['indifference']);

    var action_a_value = Number(all_actions[action_a]['criteria'][0][criterion_name]);
    var action_b_value = Number(all_actions[action_b]['criteria'][0][criterion_name]);

    var numerator = criterion_preference - Math.min(action_b_value - action_a_value, criterion_preference);
    var denominator = criterion_preference - Math.min(action_b_value - action_a_value, criterion_indifference);
    var relation = numerator / denominator;

    return relation;
  }

  function symmetricOutrankingRelations(criterion, action_a, action_b) {
    return Math.min(outrankingRelations(criterion, action_a, action_b), outrankingRelations(criterion, action_b, action_a));
  }

  function concordanceIndex(category, action_a, action_b) {
    var totalSum = 0;
    for(criterion in criteria) {
      var weight = Number(categories[category]['weights'][0][criteria[criterion]['name']]);
      var Ij = symmetricOutrankingRelations(criterion, action_a, action_b);
      totalSum += weight * Ij;
    }

    return totalSum;
  }

  function discordanceRelationS(criterion, action_a, action_b) {
    var criterion_name = criteria[criterion]['name'];
    var criterion_preference = Number(criteria[criterion]['parameters'][0]['preference']);
    var criterion_veto = Number(criteria[criterion]['parameters'][0]['veto']);

    var action_a_value = Number(all_actions[action_a]['criteria'][0][criterion_name]);
    var action_b_value = Number(all_actions[action_b]['criteria'][0][criterion_name]);

    return Math.min(1, Math.max(0, ((action_b_value - action_a_value - criterion_preference)/(criterion_veto - criterion_preference))));
  }

  function discordanceRelationI(criterion, action_a, action_b) {
    return Math.max(discordanceRelationS(criterion, action_a, action_b), discordanceRelationS(criterion, action_b, action_a));
  }

  function discordanceIndex(action_a, action_b) {
    var discordance_values = [];
    for(criterion in criteria) {
      var discordance_result = discordanceRelationI(criterion, action_a, action_b);
      discordance_values.push(discordance_result);
    }
    var max_value = discordance_values[0];
    for(i = 1; i < discordance_values.length; i++) {
      if(discordance_values[i] > max_value)
        max_value = discordance_values[i];
    }
    return max_value;
  }

  function indifferenceIndex(category, action_a, action_b) {
    var c = concordanceIndex(category, action_a, action_b);
    var d = discordanceIndex(action_a, action_b);
    console.log('action_a: ' + all_actions[action_a]['name'] + ', action_b: ' + all_actions[action_b]['name'] + ', concordance: ' + c + ', discordance: ' + d);
    return Math.min(c, 1 - d);
  }

  function membershipDegree(category, action_a) {
    var indifference_values = [];

    for(typical_action in categories[category]['typical_actions'][0]) {
      var typical_action_index;
      //find the typical_action's position in the all_actions array
      for(action in all_actions) {
        if(all_actions[action]['name'] == typical_action) {
          typical_action_index = action;
          break;
        }
      }
      indifference_values.push(indifferenceIndex(category, action_a, typical_action_index));
    }

    var max_value = indifference_values[0];
    for(i = 1; i < indifference_values.length; i++) {
      if(indifference_values[i] > max_value)
        max_value = indifference_values[i];
    }

    return max_value;
  }

  function crispAssignment(category, action_a) {
    //console.log(membershipDegree(category, action_a));
    if(membershipDegree(category, action_a) >= cutting_threshold['value'])
      return true;
    else
      return false;
  }

  function fuzzySet(action_a) {
    var membership_values = [];

    for(category in categories)
      membership_values.push(membershipDegree(categories[category]['name'], action_a));

    var max_value = membership_values[0];
    for(i = 1; i < membership_values.length; i++) {
      if(membership_values[i] > max_value)
        max_value = membership_values[i];
    }

    return (1 - max_value);
  }

  function getConcordanceResults() {
    var concordance_text = '{"categories":[';

    for(category in categories) {
      concordance_text += '{"name":"' + categories[category]['name'] + '","results":[';

      for(typical_action in categories[category]['typical_actions'][0]) {
        var typical_index;
        //find the position of typical_action in all_actions
        for(action_index in all_actions)
          if(all_actions[action_index]['name'] == typical_action)
            typical_index = action_index;

        for(action in actions) {
          //console.log('action ' + all_actions[action]['name'] + ', typical_index ' + all_actions[typical_index]['name']);
          var result = Math.round(concordanceIndex(category, action, typical_index) * 100) / 100;
          //console.log(result);
          concordance_text += '{"action":"' + all_actions[action]['name'] + '","typical_action":"' + all_actions[typical_index]['name'] + '","result":"' + result + '"},';
        }
      }
      if(concordance_text[concordance_text.length - 1] == ',')
        concordance_text = concordance_text.substring(0, concordance_text.length - 1);

      concordance_text += ']},'
    }
    if(concordance_text[concordance_text.length - 1] == ',')
      concordance_text = concordance_text.substring(0, concordance_text.length - 1);

    concordance_text += ']}';
    //console.log(concordance_text);
    $scope.concordance_indices = JSON.parse(concordance_text);
  }

  function getDiscordanceResults() {
    var concordance_text = '{"categories":[';

    for(category in categories) {
      concordance_text += '{"name":"' + categories[category]['name'] + '","results":[';

      for(typical_action in categories[category]['typical_actions'][0]) {
        var typical_index;
        //find the position of typical_action in all_actions
        for(action_index in all_actions)
          if(all_actions[action_index]['name'] == typical_action)
            typical_index = action_index;

        for(action in actions) {
          //console.log('action ' + action + ', typical_index ' + typical_index);
          var result = Math.round(discordanceIndex(action, typical_index) * 100) / 100;
          //console.log(result);
          concordance_text += '{"action":"' + all_actions[action]['name'] + '","typical_action":"' + all_actions[typical_index]['name'] + '","result":"' + result + '"},';
        }
      }
      if(concordance_text[concordance_text.length - 1] == ',')
        concordance_text = concordance_text.substring(0, concordance_text.length - 1);

      concordance_text += ']},'
    }
    if(concordance_text[concordance_text.length - 1] == ',')
      concordance_text = concordance_text.substring(0, concordance_text.length - 1);

    concordance_text += ']}';
    //console.log(concordance_text);
    $scope.discordance_indices = JSON.parse(concordance_text);
  }

  function getIndifferenceResults() {
    var concordance_text = '{"categories":[';

    for(category in categories) {
      concordance_text += '{"name":"' + categories[category]['name'] + '","results":[';

      for(typical_action in categories[category]['typical_actions'][0]) {
        var typical_index;
        //find the position of typical_action in all_actions
        for(action_index in all_actions)
          if(all_actions[action_index]['name'] == typical_action)
            typical_index = action_index;

        for(action in actions) {
          //console.log('action ' + action + ', typical_index ' + typical_index);
          var result = Math.round(indifferenceIndex(category, action, typical_index) * 100) / 100;
          //console.log(result);
          concordance_text += '{"action":"' + all_actions[action]['name'] + '","typical_action":"' + all_actions[typical_index]['name'] + '","result":"' + result + '"},';
        }
      }
      if(concordance_text[concordance_text.length - 1] == ',')
        concordance_text = concordance_text.substring(0, concordance_text.length - 1);

      concordance_text += ']},'
    }
    if(concordance_text[concordance_text.length - 1] == ',')
      concordance_text = concordance_text.substring(0, concordance_text.length - 1);

    concordance_text += ']}';
    //console.log(concordance_text);
    $scope.indifference_indices = JSON.parse(concordance_text);
  }

  function getMembershipResults() {
    var concordance_text = '{"categories":[';

    for(category in categories) {
      concordance_text += '{"name":"' + categories[category]['name'] + '","results":[';

      for(new_action in actions) {
        var result = Math.round(membershipDegree(category, new_action) * 100) / 100;
        concordance_text += '{"action":"' + all_actions[new_action]['name'] + '","result":"' + result + '"},';
      }

      if(concordance_text[concordance_text.length - 1] == ',')
        concordance_text = concordance_text.substring(0, concordance_text.length - 1);

      concordance_text += ']},'
    }
    if(concordance_text[concordance_text.length - 1] == ',')
      concordance_text = concordance_text.substring(0, concordance_text.length - 1);

    concordance_text += ']}';
    //console.log(concordance_text);
    $scope.membership_indices = JSON.parse(concordance_text);
  }

  function getCripAssignmentResults() {
    var crisp_text = '';

    for(category in categories) {
      crisp_text += categories[category]['name'] + ' = {';

      for(new_action in actions) {
        var result = crispAssignment(category, new_action);

        if(result == true)
          crisp_text += all_actions[new_action]['name'] + ',';
      }

      if(crisp_text[crisp_text.length - 1] == ',')
        crisp_text = crisp_text.substring(0, crisp_text.length - 1);

      crisp_text += '} ';
    }

    if(crisp_text[crisp_text.length - 1] == ',')
      crisp_text = crisp_text.substring(0, crisp_text.length - 1);

    $scope.crisp_assignment = crisp_text;
  }

  function getResults() {
    $http.get('/FIPCriteria').success(function(response) {
      criteria = response;

      $http.get('/FIPActions').success(function(response1) {
        actions = response1;

        $http.get('/FIPTypicalActions').success(function(response2) {
          typical_actions = response2;

          $http.get('/FIPCategories').success(function(response3) {
            categories = response3;

            $http.get('/FIPCuttingThreshold').success(function(response4) {
              cutting_threshold = response4[0];

              //auxiliary variable so that actions is not changed
              var actions_aux = [];
              for(action in actions)
                actions_aux.push(actions[action]);

              //join list of actions and typical actions
              all_actions = extend(typical_actions, actions_aux);

              getConcordanceResults();

              getDiscordanceResults();

              getIndifferenceResults();

              getMembershipResults();

              getCripAssignmentResults();
            });
          });
        });
      });
    });
  }

  $scope.getData = function() {
    $window.location.href = 'InputData.html';
  }

  getResults();
}]);
