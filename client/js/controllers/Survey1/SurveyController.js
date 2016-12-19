app.controller('SurveyController', ['$scope', '$http', function($scope, $http){
  //attributes to be shown, 0 if not checked and 1 otherwise
  var attributesList = {'Option 1':0, 'Option 2':0, 'Option 3':0};
  //types of the attributes
  var typesAttrList = {'Option 1':'', 'Option 2':'', 'Option 3':''};
  //list of the classes and their attributes
  var classAttr = [];
  //list of the cities and their classes
  var cityClass = [];
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

    //selected attributes
    var selectedAttributesText = '[';

    for(attr in attributesList) {
      attributesText += '{"name":"' + attr + '","checked":"' + attributesList[attr] + '","type":"' + typesAttrList[attr] + '"},';
      if(attributesList[attr] == 1)
        selectedAttributesText += '"' + attr + '",';
    }

    if(attributesText[attributesText.length - 1] == ',')
      attributesText = attributesText.substring(0, attributesText.length - 1);

    if(selectedAttributesText[selectedAttributesText.length - 1] == ',')
      selectedAttributesText = selectedAttributesText.substring(0, selectedAttributesText.length - 1);

    attributesText += ']';
    selectedAttributesText += ']';

    $scope.attributes = JSON.parse(attributesText);
    $scope.selectedattributes = JSON.parse(selectedAttributesText);
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

    for(i = 0; i < cityClass.length; i++) {
      citiesText += '{"name":"' + cityClass[i][0] + '","classes":[';

      for(j = 0; j < cityClass[i][1].length; j++)
          citiesText += '"' + cityClass[i][1][j] + '",';

      if(citiesText[citiesText.length - 1] == ',')
        citiesText = citiesText.substring(0, citiesText.length - 1);

      citiesText += ']},';
    }

    if(citiesText[citiesText.length - 1] == ',')
      citiesText = citiesText.substring(0, citiesText.length - 1);

    citiesText += ']';

    $scope.cities = JSON.parse(citiesText);
  }

  //get the previously selected attributes by the user
  function getSelectedAttributes() {
    //all the documents from that collection are retrieved
    $http.get('/Attributes').success(function(response) {
      for(i = 0; i < response.length; i++) {
        //find the document of this user
        if(response[i].key == key) {
          //get the id of the document
          documentId = response[i]._id;

          //get the attributes and corresponding types
          for(j = 0; j < response[i].attributes.length; j++) {
            var attrExists = 0
            //look for the option in the current added options
            for(attr in attributesList) {
              //if option is already added, then check it
              if(attr == response[i].attributes[j].name) {
                attrExists = 1;
                attributesList[attr] = 1;
                typesAttrList[attr] = response[i].attributes[j].type;
                break;
              }
            }
            //otherwise, add and check it
            if(!attrExists) {
              attributesList[response[i].attributes[j].name] = 1;
              typesAttrList[response[i].attributes[j].name] = response[i].attributes[j].type;
            }
          }

          //get the classes
          for(j = 0; j < response[i].classes.length; j++) {
            var newClassAttr = [];
            for(k = 0; k < response[i].classes[j].attributes.length; k++)
              newClassAttr.push(response[i].classes[j].attributes[k]);
            classAttr.push([response[i].classes[j].name, newClassAttr]);
          }

          //get the cities
          for(j = 0; j < response[i].cities.length; j++) {
            var newCityClass = [];
            for(k = 0; k < response[i].cities[j].classes.length; k++)
              newCityClass.push(response[i].cities[j].classes[k]);
            cityClass.push([response[i].cities[j].name, newCityClass]);
          }
        }
      }
      refreshAttributes();
      refreshClasses();
      refreshCities();
    });
  }

  //add the new attribute given by the user
  $scope.addAttribute = function() {
    attributesList[$scope.newAttribute.name] = 1;
    refreshAttributes();
  }

  //add the new class given by the user
  $scope.addClass = function() {
    classAttr.push([$scope.newClass.name, []]);
    refreshClasses();
  }

  $scope.deleteClass = function(className) {
    for(i = 0; i < classAttr.length; i++)
      if(classAttr[i][0] == className)
        classAttr.splice(i, 1);

    refreshClasses();
  }

  //update the list of selected attributes of a class
  $scope.updateClassAttr = function(className, attrName) {
    for(i = 0; i < classAttr.length; i++) {
      if(classAttr[i][0] == className) {
        if(classAttr[i][1].indexOf(attrName) == -1)
          classAttr[i][1].push(attrName);
        else
          classAttr[i][1].splice(classAttr[i][1].indexOf(attrName), 1);
      }
    }
  }

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

  $scope.addCity = function() {
    cityClass.push([$scope.newCity, []]);
    refreshCities();
  }

  $scope.deleteCity = function(cityName) {
    for(i = 0; i < cityClass.length; i++)
      if(cityClass[i][0] == cityName)
        cityClass.splice(i, 1);

    refreshCities();
  }

  $scope.cityClassChecked = function(cityName, className) {
    for(i = 0; i < cityClass.length; i++) {
      if(cityClass[i][0] == cityName) {
        if(cityClass[i][1].indexOf(className) == -1)
          return false;
        else
          return true;
      }
    }
  }

  //update the list of selected classes of a city
  $scope.updateCityClass = function(cityName, className) {
    for(i = 0; i < cityClass.length; i++) {
      if(cityClass[i][0] == cityName) {
        if(cityClass[i][1].indexOf(className) == -1)
          cityClass[i][1].push(className);
        else
          cityClass[i][1].splice(cityClass[i][1].indexOf(className), 1);
      }
    }
  }

  //see if two cities were already added
  $scope.enoughCities = function() {
    for(i = 0; i < cityClass.length; i++);

    if(i < 2)
      return true;
    else
      return false;
  }

  //update the state of the attributes
  $scope.updateAttrList = function(attrName) {
    if(attributesList[attrName] == 0)
      attributesList[attrName] = 1;
    else
      attributesList[attrName] = 0;

    refreshAttributes();
  }

  //update the state of the select boxes
  $scope.updateTypesList = function(attrName, typeName) {
    typesAttrList[attrName] = typeName;
  }

  $scope.submitAttributes = function() {
    //if the user has submitted attributes before
    if(documentId != '') {
      //delete previous document
      $http.delete('/Attributes/' + documentId).success(function(response) {
        postAttributes();
      });
    }
    else
      postAttributes();
  }

  function postAttributes() {
    //write new document and post it
    //add the user's key and the options
    var newDoc = '{"key":"' + key + '", "attributes": [';

    //find the selected attributes
    for(attr in attributesList)
      if(attributesList[attr] == 1)
        newDoc += '{"name":"' + attr + '","type":"' + typesAttrList[attr] + '"},';

    //remove last comma from newDoc
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

    for(i = 0 ; i < cityClass.length; i++) {
      newDoc += '{"name":"' + cityClass[i][0] + '", "classes":[';

      for(j = 0; j < cityClass[i][1].length; j++)
        newDoc += '"' + cityClass[i][1][j] + '",';

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
    });
  }

  getKey();
  getSelectedAttributes();
}]);
