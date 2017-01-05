app.controller('ResultsController', ['$scope', '$http', function($scope, $http){
  var originalResults;

  function getResults() {
    //all the documents from that collection are retrieved
    $http.get('/Attributes').success(function(response) {
      //save the original results
      $scope.originalResults = response.sort(function(a, b){
        return a.number - b.number;
      });;

      //a new JSON object will be created so that all_attributes can be added for every user
      var resultsText = '[';

      //for every document in response
      for(i = 0; i < response.length; i++) {

        resultsText += '{"number":"' + response[i].number + '","cities":[';

        //stores all attributes for a user
        var attributes_id = [];

        //get the cities
        for(j = 0; j < response[i].cities.length; j++) {

          resultsText += '{"name":"' + response[i].cities[j].name + '", "attributes":[';

          //get the attributes
          for(k = 0; k < response[i].cities[j].attributes.length; k++) {
            resultsText += '{"name":"' + response[i].cities[j].attributes[k].name + '"},';

            //if the attribute has already been added to attributes_id, then ignore it. Otherwise, add it to the array
            if(!attributes_id.includes(response[i].cities[j].attributes[k].name))
              attributes_id.push(response[i].cities[j].attributes[k].name);
          }

          resultsText = removeComma(resultsText);

          resultsText += ']},';
        }

        resultsText = removeComma(resultsText);

        //sort by the name of the attribute
        attributes_id.sort();

        resultsText += '],"all_attributes":[';

        //add all attributes selected by the user
        for(m = 0; m < attributes_id.length; m++) {
          resultsText += '{"name":"' + attributes_id[m] + '"},';
        }

        resultsText = removeComma(resultsText);

        resultsText += ']},';
      }

      resultsText = removeComma(resultsText);

      resultsText += ']';

      $scope.results = JSON.parse(resultsText);

      //sort by student id
      $scope.results.sort(function(a, b){
        return a.number - b.number;
      });
    });
  }

  $scope.defineTdStyle = function(attribute_name, city_name, result) {
    if($scope.attributeSelected(attribute_name, city_name, result)) {
      return {
        "background-color":"#5cb85c"
      };
    }
    else {
      return {
        "background-color":"none"
      };
    }
  }

  $scope.attributeSelected = function(attribute_name, city_name, result) {
    for(i = 0; i < result.cities.length; i++)
      if(result.cities[i].name == city_name)
        for(j = 0; j < result.cities[i].attributes.length; j++)
          if(result.cities[i].attributes[j].name == attribute_name)
            return true;

    return false;
  }

  $scope.JSONtoCSV = function() {
    var CSV = '';

    CSV += 'Number, City 1, Attributes City 1, City 2, Attributes City 2\r\n';

    for(i = 0; i < $scope.originalResults.length; i++) {
      CSV += $scope.originalResults[i].number + ',';

      for(j = 0; j < $scope.originalResults[i].cities.length; j++) {
        CSV += $scope.originalResults[i].cities[j].name + ',"';

        for(k = 0; k < $scope.originalResults[i].cities[j].attributes.length; k++)
          CSV += $scope.originalResults[i].cities[j].attributes[k].name + ',';

        CSV = removeComma(CSV);

        CSV += '",';
      }

      CSV = removeComma(CSV);

      CSV += '\r\n';
    }

    //initialize file format
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect the web-layout
    link.style = "visibility:hidden";
    link.download = "results.csv";

    //append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    }

    //if there is a comma in the last position of the string, remove it
    function removeComma(text) {
      if(text[text.length - 1] == ',')
        text = text.substring(0, text.length - 1);
      return text;
    }

    getResults();
}]);
