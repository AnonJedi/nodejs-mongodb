'use strict';

const express          = require('express');
const mongoose         = require('mongoose');
const bodyParser       = require('body-parser');
const morgan           = require('morgan');
const passport         = require('./controllers/auth').passport;
const unauthHandler    = require('./controllers/auth').unauthHandler;
const userRouter       = require('./routes/user');
const authRouter       = require('./routes/auth');
const postRouter       = require('./routes/post');

const app = express();

const dbUrl = `mongodb://${process.env.DATABASE_USER}:${process.env.MONGODB_PASS}@mongodb:27017/${process.env.DATABASE_NAME}`;

mongoose.Promise = global.Promise;

const tryToConnectDB = () => {
	mongoose.connect(dbUrl, function(error) {
		if (!error) {
			console.log('DB connection complete');
			clearInterval(intervalId);
			return;
		}	
		console.log('Waiting for db connect...');
	});	
};

const intervalId = setInterval(tryToConnectDB, 1000);

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
