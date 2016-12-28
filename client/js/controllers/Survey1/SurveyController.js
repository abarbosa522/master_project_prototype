app.controller('SurveyController', ['$scope', '$http', function($scope, $http){
  //list of types
  var typesList = [];

  //types of the attributes
  var typesAttrList = {'Agencies':'', 'Agents':'', 'Beneficts':'', 'Big Data':'', 'Broadband Infrastructure':'', 'Citizens':'',
  'Cloud Infrastructure':'', 'Cognitive Design':'', 'Collaboration':'', 'Communication':'', 'Community':'', 'Creativity':'',
  'Cybersecurity':'', 'Data Analysis':'', 'Data Collecting':'', 'Data Reuse':'', 'Data Sharing':'', 'Decision Making':'', 'Economy':'',
  'Education':'', 'Efficiency':'', 'Energy':'', 'Environmental Changes':'', 'Environmental Footprint':'', 'Funding':'', 'Globalization':'',
  'Health':'', 'Human Infrastructure':'', 'Information System':'', 'Inner and Outer Factors':'', 'Innovation':'',
  'Institutional Infrastructure':'', 'International':'', 'Internet of Things (IoT)':'', 'Investment':'', 'Local':'', 'Managers':'',
  'Mobility':'', 'Municipalities':'', 'National':'', 'Open Data':'', 'Open Government':'', 'Open Government Data':'', 'Operationals':'',
  'Opportunities':'', 'Organization':'', 'Policies':'', 'Politicians':'', 'Pollution':'', 'Privacy':'', 'Private Sector':'',
  'Productivity':'', 'Projects':'', 'Public Services':'', 'Quality of Life':'', 'Real Time':'', 'Renewable Energy':'', 'Replicable Models':'',
  'Research and Development (R&D)':'', 'Resources':'', 'Safety':'', 'Security':'', 'Sensor Devices':'', 'Sensors':'', 'Services':'',
  'Smart':'', 'Social Learning':'', 'Solutions':'', 'Strategy':'', 'Surveillance':'', 'Sustainability':'', 'Systemic Holistic View':'',
  'Technocratic':'', 'Transport Network':'', 'Ubiquitous Computing':'', 'Urban Growth':'', 'Urban Population':'', 'Urbanism':'',
  'Value':'', 'Waste':'', 'Water':'', 'Wireless Ad Hoc Networks (WANET, ...)':'', 'Wireless Sensor Networks (WSN)':''};

  //list of the cities and their classes
  var cityClass = {};

  //id of the document that contains the attributes the current user
  var documentId = '';

  //user's key
  var key = '';

  //get the user's key
  function getKey() {
    var url = window.location.href;
    key = url.substr(url.indexOf('?') + 1);
  }

  //update the list of types
  function refreshTypes() {
    var typesText = '[';

    //convert types to one JSON string
    for(i = 0; i < typesList.length; i++)
      typesText += '{"name":"' + typesList[i] + '"},';

    //remove the last comma, if it is there
    if(typesText[typesText.length - 1] == ',')
      typesText = typesText.substring(0, typesText.length - 1);

    //terminate JSON string
    typesText += ']';

    //convert it to JSON object
    $scope.types = JSON.parse(typesText);
  }

  //update the list of attributes
  function refreshAttributes() {
    //all attributes
    var attributesText = '[';

    for(attr in typesAttrList)
      attributesText += '{"name":"' + attr + '","type":"' + typesAttrList[attr] + '"},';

    if(attributesText[attributesText.length - 1] == ',')
      attributesText = attributesText.substring(0, attributesText.length - 1);

    attributesText += ']';

    $scope.attributes = JSON.parse(attributesText);
  }

  //update the list of cities
  function refreshCities() {
    var citiesText = '[';

    for(city in cityClass)
      citiesText += '{"name":"' + city + '","class":"' + cityClass[city] + '"},';

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

          //get the types
          for(j = 0; j < response[i].types.length; j++)
              typesList.push(response[i].types[j]);

          //get the attributes and corresponding types
          for(j = 0; j < response[i].attributes.length; j++)
            typesAttrList[response[i].attributes[j].name] = response[i].attributes[j].type;

          //get the cities
          for(j = 0; j < response[i].cities.length; j++)
            cityClass[response[i].cities[j].name] = response[i].cities[j].class;

        }
      }
      refreshTypes();
      refreshAttributes();
      refreshCities();
    });
  }

  //add a new type
  $scope.addType = function() {
    //new type is selected by default
    typesList.push($scope.newType);

    //clear the input text field
    $scope.newType = '';

    //update $scope.types
    refreshTypes();

    //submit the new changes and don't show the success alert
    //$scope.submitForm(false);
  }

  //delete a type
  $scope.deleteType = function(typeName) {
    //find and remove the type from the typesList
    var index = typesList.indexOf(typeName);

    if(index > -1)
      typesList.splice(index, 1);

    //find and remove the type from the list of attribute-type
    for(i = 0; i < typesAttrList.length; i++)
      if(typesAttrList[i] == typeName)
        typesAttrList[i] = '';

    //update the $scope.types and $scope.attributes
    refreshTypes();
    refreshAttributes();

    //submit the new changes and don't show the success alert
    //$scope.submitForm(false);
  }

  //add the new attribute given by the user
  $scope.addAttribute = function() {
    var newAttr = $scope.newAttribute;

    //the new attribute doesn't have a corresponding class by default
    typesAttrList[$scope.newAttribute] = '';

    //clear the input text field
    $scope.newAttribute = '';

    //update $scope.attributes
    refreshAttributes();

    //submit the new changes and don't show the success alert
    //$scope.submitForm(false);
  }

  //update the list of types of an attribute
  $scope.updateAttrTypesList = function(attrName, typeName) {
    typesAttrList[attrName] = typeName;

    //update $scope.attributes
    refreshAttributes();

    //submit the new changes and don't show the success alert
    //$scope.submitForm(false);
  }

  //find if the class is the city's value
  //city is the key, class is the value
  $scope.cityClassChecked = function(cityName, typeName) {
    if(cityClass[cityName] == typeName)
      return true;
    else
      return false;
  }

  //update the list of the selected class of a city
  $scope.updateCityClass = function(cityName, typeName) {
    cityClass[cityName] = typeName;

    //update $scope.cities
    refreshCities();

    //submit the new changes and don't show the success alert
    //$scope.submitForm(false);
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
    var newDoc = '{"key":"' + key + '", "types":[';

    for(i = 0; i < typesList.length; i++)
      newDoc += '"' + typesList[i] + '",';

    if(newDoc[newDoc.length - 1] == ',')
      newDoc = newDoc.substring(0, newDoc.length - 1);

    //add the attributes and their type
    newDoc += '], "attributes":[';

    //find the selected attributes
    for(attr in typesAttrList)
      if(typesAttrList[attr] != '')
        newDoc += '{"name":"' + attr + '","type":"' + typesAttrList[attr] + '"},';

    //remove last comma from newDoc
    if(newDoc[newDoc.length - 1] == ',')
      newDoc = newDoc.substring(0, newDoc.length - 1);

    //add the cities and corresponding classes
    newDoc += '], "cities":[';

    for(city in cityClass)
      newDoc += '{"name":"' + city + '", "class":"' + cityClass[city] + '"},';

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
    typesList = [];

    typesAttrList = {'Agencies':'', 'Agents':'', 'Beneficts':'', 'Big Data':'', 'Broadband Infrastructure':'', 'Citizens':'',
    'Cloud Infrastructure':'', 'Cognitive Design':'', 'Collaboration':'', 'Communication':'', 'Community':'', 'Creativity':'',
    'Cybersecurity':'', 'Data Analysis':'', 'Data Collecting':'', 'Data Reuse':'', 'Data Sharing':'', 'Decision Making':'', 'Economy':'',
    'Education':'', 'Efficiency':'', 'Energy':'', 'Environmental Changes':'', 'Environmental Footprint':'', 'Funding':'', 'Globalization':'',
    'Health':'', 'Human Infrastructure':'', 'Information System':'', 'Inner and Outer Factors':'', 'Innovation':'',
    'Institutional Infrastructure':'', 'International':'', 'Internet of Things (IoT)':'', 'Investment':'', 'Local':'', 'Managers':'',
    'Mobility':'', 'Municipalities':'', 'National':'', 'Open Data':'', 'Open Government':'', 'Open Government Data':'', 'Operationals':'',
    'Opportunities':'', 'Organization':'', 'Policies':'', 'Politicians':'', 'Pollution':'', 'Privacy':'', 'Private Sector':'',
    'Productivity':'', 'Projects':'', 'Public Services':'', 'Quality of Life':'', 'Real Time':'', 'Renewable Energy':'', 'Replicable Models':'',
    'Research and Development (R&D)':'', 'Resources':'', 'Safety':'', 'Security':'', 'Sensor Devices':'', 'Sensors':'', 'Services':'',
    'Smart':'', 'Social Learning':'', 'Solutions':'', 'Strategy':'', 'Surveillance':'', 'Sustainability':'', 'Systemic Holistic View':'',
    'Technocratic':'', 'Transport Network':'', 'Ubiquitous Computing':'', 'Urban Growth':'', 'Urban Population':'', 'Urbanism':'',
    'Value':'', 'Waste':'', 'Water':'', 'Wireless Ad Hoc Networks (WANET, ...)':'', 'Wireless Sensor Networks (WSN)':''};

    refreshTypes();
    refreshAttributes();
    refreshCities();
  }

  $scope.reload = function() {
    typesList = [];

    typesAttrList = {'Agencies':'', 'Agents':'', 'Beneficts':'', 'Big Data':'', 'Broadband Infrastructure':'', 'Citizens':'',
    'Cloud Infrastructure':'', 'Cognitive Design':'', 'Collaboration':'', 'Communication':'', 'Community':'', 'Creativity':'',
    'Cybersecurity':'', 'Data Analysis':'', 'Data Collecting':'', 'Data Reuse':'', 'Data Sharing':'', 'Decision Making':'', 'Economy':'',
    'Education':'', 'Efficiency':'', 'Energy':'', 'Environmental Changes':'', 'Environmental Footprint':'', 'Funding':'', 'Globalization':'',
    'Health':'', 'Human Infrastructure':'', 'Information System':'', 'Inner and Outer Factors':'', 'Innovation':'',
    'Institutional Infrastructure':'', 'International':'', 'Internet of Things (IoT)':'', 'Investment':'', 'Local':'', 'Managers':'',
    'Mobility':'', 'Municipalities':'', 'National':'', 'Open Data':'', 'Open Government':'', 'Open Government Data':'', 'Operationals':'',
    'Opportunities':'', 'Organization':'', 'Policies':'', 'Politicians':'', 'Pollution':'', 'Privacy':'', 'Private Sector':'',
    'Productivity':'', 'Projects':'', 'Public Services':'', 'Quality of Life':'', 'Real Time':'', 'Renewable Energy':'', 'Replicable Models':'',
    'Research and Development (R&D)':'', 'Resources':'', 'Safety':'', 'Security':'', 'Sensor Devices':'', 'Sensors':'', 'Services':'',
    'Smart':'', 'Social Learning':'', 'Solutions':'', 'Strategy':'', 'Surveillance':'', 'Sustainability':'', 'Systemic Holistic View':'',
    'Technocratic':'', 'Transport Network':'', 'Ubiquitous Computing':'', 'Urban Growth':'', 'Urban Population':'', 'Urbanism':'',
    'Value':'', 'Waste':'', 'Water':'', 'Wireless Ad Hoc Networks (WANET, ...)':'', 'Wireless Sensor Networks (WSN)':''};

    cityClass = {};

    getPreviousDoc();
  }

  getKey();
  getPreviousDoc();
}]);
