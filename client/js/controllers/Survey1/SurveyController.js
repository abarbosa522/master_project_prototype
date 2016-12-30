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
    //all attributes
    var attributesText = '[';

    for(i = 0; i < attrList.length; i++)
      attributesText += '{"name":"' + attrList[i] + '"},';

    if(attributesText[attributesText.length - 1] == ',')
      attributesText = attributesText.substring(0, attributesText.length - 1);

    attributesText += ']';

    $scope.attributes = JSON.parse(attributesText);
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
    var newDoc = '{"key":"' + key + '", "cities":[';

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

    refreshAttributes();
    refreshCities();
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

    getPreviousDoc();
  }

  getKey();
  getPreviousDoc();
}]);
