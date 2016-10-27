'use strict';

var express          = require('express'),
    mongoose         = require('mongoose'),
	bodyParser       = require('body-parser'),
    passport         = require('./controllers/auth').passport,
	unauthHandler    = require('./controllers/auth').unauthHandler,
    userRouter       = require('./routes/user'),
    authRouter       = require('./routes/auth'),
	postRouter       = require('./routes/post');

var app = express();

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

mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({
  	extended: true
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/users/:userId/posts', postRouter);

app.use(unauthHandler);

app.listen(3000);
