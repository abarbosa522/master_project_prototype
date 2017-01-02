app.controller('SurveyController', ['$scope', '$http', function($scope, $http){
  //list of types
  var typesList = [];

  //list of attributes
  var attrList = ['Agencies', 'Agents', 'Beneficts', 'Big Data', 'Broadband Infrastructure', 'Citizens', 'Cloud Infrastructure',
  'Cognitive Design', 'Collaboration', 'Communication', 'Community', 'Creativity', 'Cybersecurity', 'Data Analysis',
  'Data Collecting', 'Data Reuse', 'Data Sharing', 'Decision Making', 'Economy', 'Education', 'Efficiency', 'Energy',
  'Environmental Changes', 'Environmental Footprint', 'Funding', 'Globalization', 'Health', 'Human Infrastructure',
  'Information System', 'Inner and Outer Factors', 'Innovation', 'Institutional Infrastructure', 'International',
  'Internet of Things (IoT)', 'Investment', 'Local', 'Managers', 'Mobility', 'Municipalities', 'National', 'Open Data',
  'Open Government', 'Open Government Data', 'Operationals', 'Opportunities', 'Organization', 'Policies', 'Politicians', 'Pollution',
  'Privacy', 'Private Sector', 'Productivity', 'Projects', 'Public Services', 'Quality of Life', 'Real Time', 'Renewable Energy',
  'Replicable Models', 'Research and Development (R&D)', 'Resources', 'Safety', 'Security', 'Sensor Devices', 'Sensors', 'Services',
  'Smart', 'Social Learning', 'Solutions', 'Strategy', 'Surveillance', 'Sustainability', 'Systemic Holistic View', 'Technocratic',
  'Transport Network', 'Ubiquitous Computing', 'Urban Growth', 'Urban Population', 'Urbanism', 'Value', 'Waste', 'Water',
  'Wireless Ad Hoc Networks (WANET, ...)', 'Wireless Sensor Networks (WSN)'];

  //list of cities
  var cities = [];

  //attributes of each city - index 0 contains the attributes of cities[0], ...
  var cityAttr = [[], []];

  //selected attributes
  var selectedAttr = [];

  //id of the document that contains the attributes the current user
  var documentId = '';

  //user's key
  var key = '';

  //get the user's key
  function getKey() {
    var url = window.location.href;
    key = url.substr(url.indexOf('?') + 1);
  }

  //update the list of attributes
  function refreshAttributes() {
    //sort the attributes alphabetically
    attrList.sort();

    //all attributes
    var attributesText = '[';

    for(i = 0; i < attrList.length; i++)
      attributesText += '{"name":"' + attrList[i] + '"},';

    if(attributesText[attributesText.length - 1] == ',')
      attributesText = attributesText.substring(0, attributesText.length - 1);

    attributesText += ']';

    $scope.attributes = JSON.parse(attributesText);
  }

  //update the list of selected attributes
  function refreshSelectedAttributes() {
    //sort the selected attributes alphabetically
    selectedAttr.sort();

    var selectedAttrText = '[';

    for(i = 0; i < selectedAttr.length; i++)
      selectedAttrText += '{"name":"' + selectedAttr[i] + '"},';

    if(selectedAttrText[selectedAttrText.length - 1] == ',')
      selectedAttrText = selectedAttrText.substring(0, selectedAttrText.length - 1);

    selectedAttrText += ']';

    $scope.selectedAttributes = JSON.parse(selectedAttrText);

  }

  //update the list of cities
  function refreshCities() {
    var citiesText = '[';

    for(i = 0; i < cities.length; i++)
      citiesText += '{"name":"' + cities[i] + '"},';

    if(citiesText[citiesText.length - 1] == ',')
      citiesText = citiesText.substring(0, citiesText.length - 1);

    citiesText += ']';

    $scope.cities = JSON.parse(citiesText);
  }

  //get the previous document submitted by the user (or the standard one)
  function getPreviousDoc() {
    //all the documents from that collection are retrieved
    $http.get('/Attributes').success(function(response) {
      for(i = 0; i < response.length; i++) {
        //find the document of this user
        if(response[i].key == key) {
          //get the id of the document
          documentId = response[i]._id;

          //get the user's number
          $scope.number = response[i].number;

          //get the cities
          for(j = 0; j < response[i].cities.length; j++) {

            if(cities.indexOf(response[i].cities[j].name) == -1)
              cities.push(response[i].cities[j].name);

            for(k = 0; k < response[i].cities[j].attributes.length; k++) {
              //check if the user added any other attribute
              var attrIndex = attrList.indexOf(response[i].cities[j].attributes[k].name);

              if(attrIndex == -1)
                attrList.push(response[i].cities[j].attributes[k].name);

              //associate the attribute to the city
              cityAttr[j].push(response[i].cities[j].attributes[k].name);
            }
          }
        }
      }
      refreshAttributes();
      refreshCities();
      updateSelectedAttributes();
    });
  }

  //add the new attribute given by the user
  $scope.addAttribute = function() {
    var newAttr = $scope.newAttribute;

    attrList.push($scope.newAttribute);

    //clear the input text field
    $scope.newAttribute = '';

    //update $scope.attributes
    refreshAttributes();
  }

  //check if attribute is associated to the city
  $scope.checkCityAttr = function(attributeName, cityName) {
    var cityIndex = cities.indexOf(cityName);
    var attributeIndex = cityAttr[cityIndex].indexOf(attributeName);

    if(attributeIndex > -1)
      return true;
    else
      return false;
  }

  $scope.updateCityAttr = function(attributeName, cityName) {
    var cityIndex = cities.indexOf(cityName);

    var attributeIndex = cityAttr[cityIndex].indexOf(attributeName);

    //the attribute isn't in the array and the user wants to add it
    if(attributeIndex == -1)
      cityAttr[cityIndex].push(attributeName);
    //the attribute is in the array and the user wants to remove it
    else
      cityAttr[cityIndex].splice(attributeIndex, 1);

    var selectedAttrSum = 0;

    //check if the attribute is selected in any of the cities
    for(i = 0; i < cityAttr.length; i++)
      if(cityAttr[i].indexOf(attributeName) != -1)
        selectedAttrSum++;

    //check if the attribute was in the selected attributes list
    var selectedAttrIndex = selectedAttr.indexOf(attributeName);

    if(selectedAttrSum > 0 && selectedAttrIndex == -1)
      selectedAttr.push(attributeName);
    else if(selectedAttrSum == 0 && selectedAttrIndex > -1)
      selectedAttr.splice(selectedAttrIndex, 1);

    refreshSelectedAttributes();
  }

  $scope.defineTdStyle = function(selectedAttrName, cityName) {
    if(cityAttr[cities.indexOf(cityName)].indexOf(selectedAttrName) != -1) {
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

  $scope.attributeSelected = function(selectedAttrName, cityName) {
    if(cityAttr[cities.indexOf(cityName)].indexOf(selectedAttrName) != -1)
      return true;
    else
      return false;
  }

  function updateSelectedAttributes() {
    for(i = 0; i < attrList.length; i++) {

      var selectedAttrSum = 0;

      //check if the attribute is selected in any of the cities
      for(j = 0; j < cityAttr.length; j++)
        if(cityAttr[j].indexOf(attrList[i]) != -1)
          selectedAttrSum++;

      //check if the attribute was in the selected attributes list
      var selectedAttrIndex = selectedAttr.indexOf(attrList[i]);

      if(selectedAttrSum > 0 && selectedAttrIndex == -1)
        selectedAttr.push(attrList[i]);
      else if(selectedAttrSum == 0 && selectedAttrIndex > -1)
        selectedAttr.splice(selectedAttrIndex, 1);
    }

    refreshSelectedAttributes();
  }

  $scope.submitForm = function(showSuccess) {
    //if the user has submitted before
    if(documentId != '') {
      //delete previous document
      $http.delete('/Attributes/' + documentId).success(function(response) {
        //submit the new changes
        postDoc(showSuccess);
      });
    }
    //otherwise, just resubmit
    else
      postDoc(showSuccess);
  }

  //compose the json object and submit the form
  function postDoc(showSuccess) {
    //add the user's key and the types
    var newDoc = '{"number":"' + $scope.number + '", "key":"' + key + '", "cities":[';

    for(i = 0; i < cities.length; i++) {
      newDoc += '{"name":"' + cities[i] + '", "attributes":[';

      for(j = 0; j < cityAttr[i].length; j++)
        newDoc += '{"name":"' + cityAttr[i][j] + '"},';

      if(newDoc[newDoc.length - 1] == ',')
        newDoc = newDoc.substring(0, newDoc.length - 1);

      newDoc += ']},';
    }

    if(newDoc[newDoc.length - 1] == ',')
      newDoc = newDoc.substring(0, newDoc.length - 1);

    newDoc += ']}';

    var newObj = JSON.parse(newDoc);

    //post the new document
    $http.post('/Attributes', newObj).success(function(response) {
      documentId = response._id;

      //show the success alert only when the submit button is pressed
      if(showSuccess)
        $scope.showSuccessAlert = true;
    });
  }

  $scope.reset = function() {
    cityAttr = [[], []];

    attrList = ['Agencies', 'Agents', 'Beneficts', 'Big Data', 'Broadband Infrastructure', 'Citizens', 'Cloud Infrastructure',
    'Cognitive Design', 'Collaboration', 'Communication', 'Community', 'Creativity', 'Cybersecurity', 'Data Analysis',
    'Data Collecting', 'Data Reuse', 'Data Sharing', 'Decision Making', 'Economy', 'Education', 'Efficiency', 'Energy',
    'Environmental Changes', 'Environmental Footprint', 'Funding', 'Globalization', 'Health', 'Human Infrastructure',
    'Information System', 'Inner and Outer Factors', 'Innovation', 'Institutional Infrastructure', 'International',
    'Internet of Things (IoT)', 'Investment', 'Local', 'Managers', 'Mobility', 'Municipalities', 'National', 'Open Data',
    'Open Government', 'Open Government Data', 'Operationals', 'Opportunities', 'Organization', 'Policies', 'Politicians', 'Pollution',
    'Privacy', 'Private Sector', 'Productivity', 'Projects', 'Public Services', 'Quality of Life', 'Real Time', 'Renewable Energy',
    'Replicable Models', 'Research and Development (R&D)', 'Resources', 'Safety', 'Security', 'Sensor Devices', 'Sensors', 'Services',
    'Smart', 'Social Learning', 'Solutions', 'Strategy', 'Surveillance', 'Sustainability', 'Systemic Holistic View', 'Technocratic',
    'Transport Network', 'Ubiquitous Computing', 'Urban Growth', 'Urban Population', 'Urbanism', 'Value', 'Waste', 'Water',
    'Wireless Ad Hoc Networks (WANET, ...)', 'Wireless Sensor Networks (WSN)'];

    selectedAttr = [];

    refreshAttributes();
    refreshCities();
    updateSelectedAttributes();
  }

  $scope.reloadData = function() {
    cityAttr = [[], []];

    attrList = ['Agencies', 'Agents', 'Beneficts', 'Big Data', 'Broadband Infrastructure', 'Citizens', 'Cloud Infrastructure',
    'Cognitive Design', 'Collaboration', 'Communication', 'Community', 'Creativity', 'Cybersecurity', 'Data Analysis',
    'Data Collecting', 'Data Reuse', 'Data Sharing', 'Decision Making', 'Economy', 'Education', 'Efficiency', 'Energy',
    'Environmental Changes', 'Environmental Footprint', 'Funding', 'Globalization', 'Health', 'Human Infrastructure',
    'Information System', 'Inner and Outer Factors', 'Innovation', 'Institutional Infrastructure', 'International',
    'Internet of Things (IoT)', 'Investment', 'Local', 'Managers', 'Mobility', 'Municipalities', 'National', 'Open Data',
    'Open Government', 'Open Government Data', 'Operationals', 'Opportunities', 'Organization', 'Policies', 'Politicians', 'Pollution',
    'Privacy', 'Private Sector', 'Productivity', 'Projects', 'Public Services', 'Quality of Life', 'Real Time', 'Renewable Energy',
    'Replicable Models', 'Research and Development (R&D)', 'Resources', 'Safety', 'Security', 'Sensor Devices', 'Sensors', 'Services',
    'Smart', 'Social Learning', 'Solutions', 'Strategy', 'Surveillance', 'Sustainability', 'Systemic Holistic View', 'Technocratic',
    'Transport Network', 'Ubiquitous Computing', 'Urban Growth', 'Urban Population', 'Urbanism', 'Value', 'Waste', 'Water',
    'Wireless Ad Hoc Networks (WANET, ...)', 'Wireless Sensor Networks (WSN)'];

    selectedAttr = [];

    getPreviousDoc();
  }

  getKey();
  getPreviousDoc();
}]);
