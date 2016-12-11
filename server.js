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
  COLLISION_DATE : Number,
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
        console.log("OOO");
});

var Model = db.model('lb', accidentSchema, 'lb');


app.get('/', function(req, res){
	console.log(req);
  	Model.find({  
  			'COLLISION_DATE' : 20010101,
			'COLLISION_TIME' : 110 })
		.select('PRIMARY_RD')
		.exec(function(err, acc) {
			res.send(acc);
		});
});

console.log('starting the Express (NodeJS) Web server');
app.listen(8080);
console.log('Webserver is listening on port 8080');