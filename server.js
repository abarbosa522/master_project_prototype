var express = require('express');
var app = express();
var mongojs = require('mongojs');

var username = 'abarbosa';
var password = 'andrebarbosa';

//Simplified Electre Tri-C Method
var db1 = mongojs('mongodb://' + username + ':' + password + '@ds061196.mlab.com:61196/decisionspace', ['criteriadb']);
var db2 = mongojs('mongodb://' + username + ':' + password + '@ds061196.mlab.com:61196/decisionspace', ['actionsdb']);
var db3 = mongojs('mongodb://' + username + ':' + password + '@ds061196.mlab.com:61196/decisionspace', ['performancedb']);
var db4 = mongojs('mongodb://' + username + ':' + password + '@ds061196.mlab.com:61196/decisionspace', ['categoriesdb']);
var db5 = mongojs('mongodb://' + username + ':' + password + '@ds061196.mlab.com:61196/decisionspace', ['credibilitydb']);
var db6 = mongojs('mongodb://' + username + ':' + password + '@ds061196.mlab.com:61196/decisionspace', ['profileperformancedb']);

var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/client"));
app.use(bodyParser.json());

//CriteriaDB functions
app.get('/criteria', function(req, res) {
  db1.criteriadb.find().sort( {name: 1}, function (err, doc) {
    res.json(doc);
  });
});

app.post('/criteria', function(req, res) {
  db1.criteriadb.insert(req.body, function(err, doc){
    res.json(doc);
  });
});

app.delete('/criteria/:id', function(req, res) {
  var id = req.params.id;
  db1.criteriadb.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
    res.json(doc);
  });
});

//ActionsDB functions
app.get('/actions', function(req, res) {
  db2.actionsdb.find().sort( {name: 1}, function (err, doc) {
    res.json(doc);
  });
});

app.post('/actions', function(req, res) {
  db2.actionsdb.insert(req.body, function(err, doc){
    res.json(doc);
  });
});

app.delete('/actions/:id', function(req, res) {
  var id = req.params.id;
  db2.actionsdb.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
    res.json(doc);
  });
});

//PerformanceDB functions
app.get('/performancetable', function(req, res) {
  db3.performancedb.find(function(err, doc) {
    res.json(doc);
  });
});

app.post('/performancetable', function(req, res) {
  db3.performancedb.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/performancetable/:id', function(req, res) {
  var id = req.params.id;
  db3.performancedb.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
    res.json(doc);
  })
});

//CategoriesDB functions
app.get('/categories', function(req, res) {
  db4.categoriesdb.find().sort( {ranking: 1}, function (err, doc) {
    res.json(doc);
  });
});

app.post('/categories', function(req, res) {
  db4.categoriesdb.insert(req.body, function(err, doc){
    res.json(doc);
  });
});

app.delete('/categories/:id', function(req, res) {
  var id = req.params.id;
  db4.categoriesdb.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
    res.json(doc);
  });
});

//CredibilityDB functions
app.get('/credibility', function(req, res) {
  db5.credibilitydb.find(function(err, doc) {
    res.json(doc);
  });
});

app.post('/credibility', function(req, res) {
  db5.credibilitydb.insert(req.body, function(err, doc) {
      res.json(doc);
  });
});

app.put('/credibility/:id', function(req, res) {
  var id = req.params.id;
  db5.credibilitydb.findAndModify({query: {_id: mongojs.ObjectId(id)},
    update: {$set: {value: req.body.value}}, new: true}, function(err, doc) {
      res.json(doc);
    });
});

//ProfilePerformanceDB functions
app.get('/profileperformance', function(req, res) {
  db6.profileperformancedb.find(function(err, doc) {
    res.json(doc);
  });
});

app.post('/profileperformance', function(req, res) {
  db6.profileperformancedb.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/profileperformance', function(req, res) {
  db6.profileperformancedb.remove(req.body, function(err, doc) {
    res.json(doc);
  });
});

//Complete Electre Tri-C Method
var db7 = mongojs('mongodb://' + username + ':' + password + '@ds143737.mlab.com:43737/completeelectretric', ['criteriacollection']);
var db8 = mongojs('mongodb://' + username + ':' + password + '@ds143737.mlab.com:43737/completeelectretric', ['actionscollection']);
var db9 = mongojs('mongodb://' + username + ':' + password + '@ds143737.mlab.com:43737/completeelectretric', ['actionperformancecollection']);
var db10 = mongojs('mongodb://' + username + ':' + password + '@ds143737.mlab.com:43737/completeelectretric', ['categoriescollection']);
var db11 = mongojs('mongodb://' + username + ':' + password + '@ds143737.mlab.com:43737/completeelectretric', ['credibilitycollection']);
var db12 = mongojs('mongodb://' + username + ':' + password + '@ds143737.mlab.com:43737/completeelectretric', ['profileperformancecollection']);

//CriteriaCollection functions
app.get('/CompleteCriteria', function(req, res) {
  db7.criteriacollection.find().sort( {name: 1}, function (err, doc) {
    res.json(doc);
  });
});

app.post('/CompleteCriteria', function(req, res) {
  db7.criteriacollection.insert(req.body, function(err, doc){
    res.json(doc);
  });
});

app.delete('/CompleteCriteria/:id', function(req, res) {
  var id = req.params.id;
  db7.criteriacollection.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
    res.json(doc);
  });
});

//ActionsCollection functions
app.get('/CompleteActions', function(req, res) {
  db8.actionscollection.find().sort( {name: 1}, function (err, doc) {
    res.json(doc);
  });
});

app.post('/CompleteActions', function(req, res) {
  db8.actionscollection.insert(req.body, function(err, doc){
    res.json(doc);
  });
});

app.delete('/CompleteActions/:id', function(req, res) {
  var id = req.params.id;
  db8.actionscollection.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
    res.json(doc);
  });
});

//ActionPerformanceCollection functions
app.get('/CompleteActionsPerformance', function(req, res) {
  db9.actionperformancecollection.find(function(err, doc) {
    res.json(doc);
  });
});

app.post('/CompleteActionsPerformance', function(req, res) {
  db9.actionperformancecollection.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/CompleteActionsPerformance/:id', function(req, res) {
  var id = req.params.id;
  db9.actionperformancecollection.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
    res.json(doc);
  })
});

//CategoriesCollection functions
app.get('/CompleteCategories', function(req, res) {
  db10.categoriescollection.find().sort( {ranking: 1}, function (err, doc) {
    res.json(doc);
  });
});

app.post('/CompleteCategories', function(req, res) {
  db10.categoriescollection.insert(req.body, function(err, doc){
    res.json(doc);
  });
});

app.delete('/CompleteCategories/:id', function(req, res) {
  var id = req.params.id;
  db10.categoriescollection.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
    res.json(doc);
  });
});

//CredibilityCollection functions
app.get('/CompleteCredibility', function(req, res) {
  db11.credibilitycollection.find(function(err, doc) {
    res.json(doc);
  });
});

app.post('/CompleteCredibility', function(req, res) {
  db11.credibilitycollection.insert(req.body, function(err, doc) {
      res.json(doc);
  });
});

app.put('/CompleteCredibility/:id', function(req, res) {
  var id = req.params.id;
  db11.credibilitycollection.findAndModify({query: {_id: mongojs.ObjectId(id)},
    update: {$set: {value: req.body.value}}, new: true}, function(err, doc) {
      res.json(doc);
    });
});

//ProfilePerformanceCollection functions
app.get('/CompleteProfilesPerformance', function(req, res) {
  db12.profileperformancecollection.find(function(err, doc) {
    res.json(doc);
  });
});

app.post('/CompleteProfilesPerformance', function(req, res) {
  db12.profileperformancecollection.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/CompleteProfilesPerformance', function(req, res) {
  db12.profileperformancecollection.remove(req.body, function(err, doc) {
    res.json(doc);
  });
});

//Smart Cities Survey 1
var db13 = mongojs('mongodb://' + username + ':' + password + '@ds133388.mlab.com:33388/smartcitiessurvey1', ['attributescollection']);

//AttributesCollection functions
app.get('/Attributes', function(req, res) {
  db13.attributescollection.find(function(err, doc) {
    res.json(doc);
  });
});

app.post('/Attributes', function(req, res) {
  db13.attributescollection.insert(req.body, function(err, doc){
    res.json(doc);
  });
});

app.delete('/Attributes/:id', function(req, res) {
  var id = req.params.id;
  db13.attributescollection.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
    res.json(doc);
  });
});

//FIP Method
var db14 = mongojs('mongodb://' + username + ':' + password + '@ds111469.mlab.com:11469/fip', ['actions']);
var db15 = mongojs('mongodb://' + username + ':' + password + '@ds111469.mlab.com:11469/fip', ['scoringtable']);
var db16 = mongojs('mongodb://' + username + ':' + password + '@ds111469.mlab.com:11469/fip', ['categories']);
var db17 = mongojs('mongodb://' + username + ':' + password + '@ds111469.mlab.com:11469/fip', ['typicalactions']);

//Actions functions
app.get('/FIPActions', function(req, res) {
  db14.actions.find(function(err, doc) {
    res.json(doc);
  });
});

app.post('/FIPActions', function(req, res) {
  db14.actions.insert(req.body, function(err, doc){
    res.json(doc);
  });
});

app.delete('/FIPActions/:id', function(req, res) {
  var id = req.params.id;
  db14.actions.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
    res.json(doc);
  });
});

//ScoringTable functions
app.get('/FIPScoringTable', function(req, res) {
  db15.scoringtable.find(function(err, doc) {
    res.json(doc);
  });
});

app.post('/FIPScoringTable', function(req, res) {
  db15.scoringtable.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/FIPScoringTable', function(req, res) {
  db15.scoringtable.remove(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/FIPScoringTable/:id', function(req, res) {
  var id = req.params.id;
  db15.scoringtable.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
    res.json(doc);
  });
});

//Categories functions
app.get('/FIPCategories', function(req, res) {
  db16.categories.find(function(err, doc) {
    res.json(doc);
  });
});

app.post('/FIPCategories', function(req, res) {
  db16.categories.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/FIPCategories/:id', function(req, res) {
  var id = req.params.id;
  db16.categories.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
    res.json(doc);
  });
});

//TypicalActions functions
app.get('/FIPTypicalActions', function(req, res) {
  db17.typicalactions.find(function(err, doc) {
    res.json(doc);
  });
});

app.post('/FIPTypicalActions', function(req, res) {
  db17.typicalactions.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/FIPTypicalActions', function(req, res) {
  db17.typicalactions.remove(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/FIPTypicalActions/:id', function(req, res) {
  var id = req.params.id;
  db17.typicalactions.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
    res.json(doc);
  });
});

app.listen(8081);
console.log("Server running on port 8081");
