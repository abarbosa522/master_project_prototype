app.controller('SurveyController', ['$scope', '$http', function($scope, $http){
  //typs to be shown, 0 if not checked and 1 otherwise
  var typesList = {'Type 1': 0, 'Type 2': 0, 'Type 3': 0};
  //attributes to be shown, 0 if not checked and 1 otherwise
  var attributesList = {'Benefits':0, 'Citizens':0, 'Cognitive Design':0, 'Collaboration':0, 'Communication':0, 'Community':0,
'Community - Smart Community':0, 'Creativity':0, 'Big Data':0, 'Big Data - Collecting':0, 'Data Analysis':0, 'Data Sharing':0,
'Data - Real Time':0, 'Open Government Data':0, 'Open Data':0, 'Use of Data':0, 'Devices - Smart Devices and Agents':0,
'Economy':0, 'Economic Changes':0, 'Economic Growth':0, 'Smart Economy':0, 'Education':0, 'Social Learning':0, 'Efficiency':0,
'Environment Changes':0, 'Environment - Real Time Footprint':0, 'Environment - Smart':0, 'Transportation':0, 'Cost and Funding':0,
'Funding - International':0, 'Funding - National':0, 'Globalization':0, 'Government - Smart Governance':0, 'Government':0,
'Government - E-government':0, 'Government - Technocratic Governance':0, 'Health':0, 'Improved Decision Making':0, 'Infrastructure':0,
'Infrastructure - Broadband':0, 'Infrastructure - Cloud Computing':0, 'Infrastructure - Human':0, 'Infrastructure - Institutional':0,
'Infrastructure - Smart':0, 'Infrastructure - Technology':0, 'Inner and Outer Factors':0, 'Investigation':0, 'Investment':0,
'IoT - Internet of Things':0, 'Living - Lifestyle':0, 'Living - Quality of Life':0, 'Living - Smart Living':0,
'Management - City':0, 'Management - Energy':0, 'Management - Waste':0, 'Management - Water':0, 'Mobility - Smart':0,
'Mobility - Transport Network':0, 'Mobility - Urban':0, 'Municipalities':0, 'Networking':0, 'Opportunities':0, 'Organization':0,
'Policies':0, 'Pollution':0, 'Privacy':0, 'Productivity':0, 'Projects - Smart Projects':0, 'Replicable Model':0,
'Resources':0, 'Resources - Renewable Energy':0, 'Resources - Resource Consumption':0, 'Security - Cyberattacks':0,
'Security - Safety & Security':0, 'Security - Surveillance':0, 'Services - E-services':0, 'Services - Public Services':0,
'Services - Social Services':0, 'Solutions - Smart Solutions':0, 'Stackholders - Actors':0, 'Strategy - Ecological Strategy':0,
'Sustainability - Urban Development':0, 'System - Holistic View':0, 'System - Information System':0, 'System - Urban Information System':0,
'Ubiquitous Computing':0, 'Urban Growth':0, 'Urban Population':0, 'Urbanism - Smart Urbanism':0, 'VANET - Security':0};
  //types of the attributes
  var typesAttrList = {'Benefits':'', 'Citizens':'', 'Cognitive Design':'', 'Collaboration':'', 'Communication':'', 'Community':'',
'Community - Smart Community':'', 'Creativity':'', 'Big Data':'', 'Big Data - Collecting':'', 'Data Analysis':'', 'Data Sharing':'',
'Data - Real Time':'', 'Open Government Data':'', 'Open Data':'', 'Use of Data':'', 'Devices - Smart Devices and Agents':'',
'Economy':'', 'Economic Changes':'', 'Economic Growth':'', 'Smart Economy':'', 'Education':'', 'Social Learning':'', 'Efficiency':'',
'Environment Changes':'', 'Environment - Real Time Footprint':'', 'Environment - Smart':'', 'Transportation':'', 'Cost and Funding':'',
'Funding - International':'', 'Funding - National':'', 'Globalization':'', 'Government - Smart Governance':'', 'Government':'',
'Government - E-government':'', 'Government - Technocratic Governance':'', 'Health':'', 'Improved Decision Making':'', 'Infrastructure':'',
'Infrastructure - Broadband':'', 'Infrastructure - Cloud Computing':'', 'Infrastructure - Human':'', 'Infrastructure - Institutional':'',
'Infrastructure - Smart':'', 'Infrastructure - Technology':'', 'Inner and Outer Factors':'', 'Investigation':'', 'Investment':'',
'IoT - Internet of Things':'', 'Living - Lifestyle':'', 'Living - Quality of Life':'', 'Living - Smart Living':'',
'Management - City':'', 'Management - Energy':'', 'Management - Waste':'', 'Management - Water':'', 'Mobility - Smart':'',
'Mobility - Transport Network':'', 'Mobility - Urban':'', 'Municipalities':'', 'Networking':'', 'Opportunities':'', 'Organization':'',
'Policies':'', 'Pollution':'', 'Privacy':'', 'Productivity':'', 'Projects - Smart Projects':'', 'Replicable Model':'',
'Resources':'', 'Resources - Renewable Energy':'', 'Resources - Resource Consumption':'', 'Security - Cyberattacks':'',
'Security - Safety & Security':'', 'Security - Surveillance':'', 'Services - E-services':'', 'Services - Public Services':'',
'Services - Social Services':'', 'Solutions - Smart Solutions':'', 'Stackholders - Actors':'', 'Strategy - Ecological Strategy':'',
'Sustainability - Urban Development':'', 'System - Holistic View':'', 'System - Information System':'', 'System - Urban Information System':'',
'Ubiquitous Computing':'', 'Urban Growth':'', 'Urban Population':'', 'Urbanism - Smart Urbanism':'', 'VANET - Security':''};
  //list of the classes and their attributes
  var classAttr = [];
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
    var selectedTypesText = '[';

    for(type in typesList)
      typesText += '{"name":"' + type + '","checked":"' + typesList[type] + '"},';

    if(typesText[typesText.length - 1] == ',')
      typesText = typesText.substring(0, typesText.length - 1);

    typesText += ']';

    $scope.types = JSON.parse(typesText);
  }

  //update the list of attributes
  function refreshAttributes() {
    //all attributes
    var attributesText = '[';

    for(attr in attributesList)
      attributesText += '{"name":"' + attr + '","checked":"' + attributesList[attr] + '","type":"' + typesAttrList[attr] + '"},';

    if(attributesText[attributesText.length - 1] == ',')
      attributesText = attributesText.substring(0, attributesText.length - 1);

    attributesText += ']';

    $scope.attributes = JSON.parse(attributesText);
  }

  //update the list of classes
  function refreshClasses() {
    var classesText = '[';

    for(i = 0; i < classAttr.length; i++) {
      classesText += '{"name":"' + classAttr[i][0] + '","attributes":[';
      for(j = 0; j < classAttr[i][1].length; j++)
        classesText += '"' + classAttr[i][1][j] + '",';

      if(classesText[classesText.length - 1] == ',')
        classesText = classesText.substring(0, classesText.length - 1);
      classesText += ']},';
    }

    if(classesText[classesText.length - 1] == ',')
      classesText = classesText.substring(0, classesText.length - 1);
    classesText += ']';

    $scope.classes = JSON.parse(classesText);
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
          for(j = 0; j < response[i].types.length; j++) {
              typesList[response[i].types[j]] = 1;
          }

          //get the attributes and corresponding types
          for(j = 0; j < response[i].attributes.length; j++) {
            attributesList[response[i].attributes[j].name] = 1;
            typesAttrList[response[i].attributes[j].name] = response[i].attributes[j].type;
          }

          //get the classes
          for(j = 0; j < response[i].classes.length; j++) {
            var newClassAttr = [];
            for(k = 0; k < response[i].classes[j].attributes.length; k++)
              newClassAttr.push(response[i].classes[j].attributes[k]);
            classAttr.push([response[i].classes[j].name, newClassAttr]);
          }

          //get the cities
          for(j = 0; j < response[i].cities.length; j++)
            cityClass[response[i].cities[j].name] = response[i].cities[j].class;

        }
      }
      refreshAttributes();
      refreshClasses();
      refreshCities();
      refreshTypes();
    });
  }

  //add a new type
  $scope.addType = function() {
    //new type is selected by default
    typesList[$scope.newType] = 1;

    //clear the input text field
    $scope.newType = '';

    //update $scope.types
    refreshTypes();

    //submit the new changes and don't show the success alert
    $scope.submitForm(false);
  }

  //update the list of types
  $scope.updateTypesList = function(typeName) {
    //the state of the type changes to the other one (selected/unselected)
    if(typesList[typeName] == 0)
      typesList[typeName] = 1;
    else
      typesList[typeName] = 0;

    //update $scope.types
    refreshTypes();

    //submit the new changes and don't show the success alert
    $scope.submitForm(false);
  }

  //add the new attribute given by the user
  $scope.addAttribute = function() {
    //the new attribute is selected by default
    attributesList[$scope.newAttribute] = 1;

    //clear the input text field
    $scope.newAttribute = '';

    //update $scope.attributes
    refreshAttributes();

    //submit the new changes and don't show the success alert
    $scope.submitForm(false);
  }

  //update the list of attributes
  $scope.updateAttrList = function(attrName) {
    //the state of the attribute changes to the other one (selected/unselected)
    if(attributesList[attrName] == 0)
      attributesList[attrName] = 1;
    else
      attributesList[attrName] = 0;

    //update $scope.attributes
    refreshAttributes();

    //submit the new changes and don't show the success alert
    $scope.submitForm(false);
  }

  //update the list of types of an attribute
  $scope.updateAttrTypesList = function(attrName, typeName) {
    typesAttrList[attrName] = typeName;

    //update $scope.attributes
    refreshAttributes();

    //submit the new changes and don't show the success alert
    $scope.submitForm(false);
  }

  //add the new class given by the user
  $scope.addClass = function() {
    classAttr.push([$scope.newClass.name, []]);

    //clear the text input field
    $scope.newClass.name = '';

    //update $scope.classes
    refreshClasses();

    //submit the new changes and don't show the success alert
    $scope.submitForm(false);
  }

  //delete a class
  $scope.deleteClass = function(className) {
    //find and remove the class from the array
    for(i = 0; i < classAttr.length; i++)
      if(classAttr[i][0] == className)
        classAttr.splice(i, 1);

    //update the $scope.classes
    refreshClasses();

    //submit the new changes and don't show the success alert
    $scope.submitForm(false);
  }

  //update the list of selected attributes of a class
  $scope.updateClassAttr = function(className, attrName) {
    //if the attribute is in the class' array, then remove it
    //otherwise add it
    //(selected/unselected)
    for(i = 0; i < classAttr.length; i++) {
      if(classAttr[i][0] == className) {
        if(classAttr[i][1].indexOf(attrName) == -1)
          classAttr[i][1].push(attrName);
        else
          classAttr[i][1].splice(classAttr[i][1].indexOf(attrName), 1);
      }
    }

    //submit the new changes and don't show the success alert
    $scope.submitForm(false);
  }

  //find if the attribute is in the class' array
  $scope.classAttrChecked = function(className, attrName) {
    for(i = 0; i < classAttr.length; i++) {
      if(classAttr[i][0] == className) {
        if(classAttr[i][1].indexOf(attrName) == -1)
          return false;
        else
          return true;
      }
    }
  }

  //find if the class is the city's value
  //city is the key, class is the value
  $scope.cityClassChecked = function(cityName, className) {
    if(cityClass[cityName] == className)
      return true;
    else
      return false;
  }

  //update the list of the selected class of a city
  $scope.updateCityClass = function(cityName, className) {
    cityClass[cityName] = className;

    //update $scope.cities
    refreshCities();

    //submit the new changes and don't show the success alert
    $scope.submitForm(false);
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

    for(type in typesList)
      if(typesList[type] == 1)
        newDoc += '"' + type + '",';

    if(newDoc[newDoc.length - 1] == ',')
      newDoc = newDoc.substring(0, newDoc.length - 1);

    //add the attributes and their type
    newDoc += '], "attributes":[';

    //find the selected attributes
    for(attr in attributesList)
      if(attributesList[attr] == 1)
        newDoc += '{"name":"' + attr + '","type":"' + typesAttrList[attr] + '"},';

    //remove last comma from newDoc
    if(newDoc[newDoc.length - 1] == ',')
      newDoc = newDoc.substring(0, newDoc.length - 1);

    //add the classes and corresponding attributes
    newDoc += '], "classes":[';

    for(i = 0 ; i < classAttr.length; i++) {
      newDoc += '{"name":"' + classAttr[i][0] + '", "attributes":[';

      for(j = 0; j < classAttr[i][1].length; j++)
        newDoc += '"' + classAttr[i][1][j] + '",';

      if(newDoc[newDoc.length - 1] == ',')
        newDoc = newDoc.substring(0, newDoc.length - 1);

      newDoc += ']},';
    }

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

  getKey();
  getPreviousDoc();
}]);
