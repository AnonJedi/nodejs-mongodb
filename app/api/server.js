'use strict';

var express          = require('express'),
    mongoose         = require('mongoose'),
    passport         = require('./controllers/auth').passport,
	unauthHandler    = require('./controllers/auth').unauthHandler,
    userRouter       = require('./routes/user'),
    authRouter       = require('./routes/auth');

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

app.use(require('body-parser').urlencoded({
  	extended: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRouter);
app.use('/api/v1/users', userRouter);

app.use(unauthHandler);

app.listen(3000);
