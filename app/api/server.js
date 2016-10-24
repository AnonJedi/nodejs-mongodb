'use strict';

var express = require('express');
var app = express();

var mongoose = require('mongoose');
var dbUrl = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@mongodb:27017/${process.env.MONGODB_DATABASE}`

function tryToConnectDB(error) {
	mongoose.connect(dbUrl, function(error) {
		if (!error) {
			console.log('DB connection complete');
			clearInterval(intervalId);
			return;
		}	
		console.log('Waiting for db connect...');
	});	
}

var intervalId = setInterval(tryToConnectDB, 1000);

var userRouter = require('./routes/user');
app.use('/users', userRouter);


app.listen(3000);
