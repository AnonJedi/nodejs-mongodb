'use strict';

var express = require('express');
var app = express();

var mongoose = require('mongoose');
var dbUrl = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@mongodb:27017/${process.env.MONGODB_DATABASE}`

function tryToConnectDB(error) {
	mongoose.connect(dbUrl, function(error) {
		if (!error) {
			console.log('DB connection compele');
			clearInterval(intervalId);
			return;
		}	
		console.log('Waiting for db connect...');
	});	
}

var intervalId = setInterval(tryToConnectDB, 1000);

var Schema = mongoose.Schema;

var userSchema = new Schema({
	first_name: String,
	last_name: String
});

var User = mongoose.model('user', userSchema);



app.set('view engine', 'jade');
app.set('views', './app/views');

app.get('/', function(req, res){
	res.render('index', {title: 'Example'});
});

app.get('/users', function(req, res) {
	User.find({}, function(err, docs) {
		console.log(docs);
		if (err) {
			res.end(err);
		}

		res.json(docs);
	});
});

app.listen(8080);
