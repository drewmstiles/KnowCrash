var connect = require('connect');
var http = require('http');
var mongoose = require('mongoose');
var express = require('express');
var app = express();
var db;
var config = {
      "USER" : "",           
      "PASS" : "",
      "HOST" : "ec2-52-53-215-201.us-west-1.compute.amazonaws.com",  
      "PORT"    : "27017", 
     "DATABASE" : "test"
    };
    
var dbPath  = "mongodb://"+config.USER + ":"+
    config.PASS + "@"+
    config.HOST + ":"+
    config.PORT + "/"+
    config.DATABASE;

 var accidentSchema = mongoose.Schema({
  COLLISION_DATE : String,
  COLLISION_TIME : Number,
  DAY_OF_WEEK : Number,
  PRIMARY_RD : String,
  SECONDARY_RD : String,
  INTERSECTION : String,
  WEATHER_1 : String,
  COLLISION_SEVERITY : Number,
  NUMBER_KILLED : Number,
  NUMBER_INJURED : Number,
  PARTY_COUNT : Number,
  PRIMARY_COLL_FACTOR : String,
  PCF_CODE_OF_VIOL : String,
  PCF_VIOL_CATEGORY : Number,
  HIT_AND_RUN : String,
  TYPE_OF_COLLISION : String,
  MVIW : String,
  ROAD_SURFACE : String,
  ROAD_COND_1 : String,
  LIGHTING : String,
  CONTROL_DEVICE : String,
  ALCOHOL_INVOLVED : String,
  LATITUDE : Number,
  LONGITUDE : Number
}); 


db = mongoose.connect(dbPath).connection.once("open", function () {
        console.log("DB Connected");
});

var Model = db.model('lb', accidentSchema, 'lb');

/*
 * AWS Initialization
 */

var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'default'});


app.get('/', function(req, res){
	if (req.query.target == "db") {
		var query = {};
		query['COLLISION_DATE'] = new RegExp(req.query.year + '.*');
		if (req.query.severity != '*') query['COLLISION_SEVERITY'] = req.query.severity;
		if (req.query.factor != '*') query['PCF_VIOL_CATEGORY'] = req.query.factor;
		console.log(query);
		Model.find(query, function(err, result) {
				console.log(result);
				res.send(result);
			});
	}
	else {
		var machineLearning = new AWS.MachineLearning();
		
		var params = {
			"MLModelId" : "ml-hNZUvqto8HX",
			 "Record" : {
			   "DAY" : "3",
			   "TIME" : "747",
			   "WEATHER" : "A"
			 },
			 "PredictEndpoint" : "https://realtime.machinelearning.us-east-1.amazonaws.com"
			};
			
		machineLearning.predict(params, function(err, data) {
			if (err) console.log(err, err.stack);
			else res.send(data.Prediction.predictedScores);
		});
	}
});

console.log('starting the Express (NodeJS) Web server');
app.listen(8080);
console.log('Webserver is listening on port 8080');