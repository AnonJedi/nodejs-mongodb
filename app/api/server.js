'use strict';

var express          = require('express'),
    mongoose         = require('mongoose'),
	bodyParser       = require('body-parser'),
	morgan           = require('morgan'),
    passport         = require('./controllers/auth').passport,
	unauthHandler    = require('./controllers/auth').unauthHandler,
    userRouter       = require('./routes/user'),
    authRouter       = require('./routes/auth'),
	postRouter       = require('./routes/post');

var app = express();

var dbUrl = `mongodb://${process.env.DATABASE_USER}:${process.env.MONGODB_PASS}@mongodb:27017/${process.env.DATABASE_NAME}`;

mongoose.Promise = global.Promise;

function tryToConnectDB() {
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

app.use(morgan('dev'));
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
