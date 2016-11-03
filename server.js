var express = require('express');
var app = express();
var mongojs = require('mongojs');

var username = 'abarbosa';
var password = 'andrebarbosa';

//Simplified Electre Tri-C 
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

app.delete('/performancetable', function(req, res) {
  db3.performancedb.remove(function(err, doc) {
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

app.listen(8081);
console.log("Server running on port 8081");
