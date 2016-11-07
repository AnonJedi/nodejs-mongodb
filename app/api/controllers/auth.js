'use strict';


const passport        = require('passport');
const LocalStrategy   = require('passport-local').Strategy;
const BearerStrategy  = require('passport-http-bearer').Strategy;
const jwt             = require('jsonwebtoken');
const UserModel       = require('../models/user');
const AuthModel       = require('../models/auth');
const presenter       = require('../presenters/presenter');


passport.use(new LocalStrategy(
	{
		usernameField: 'login',
		passwordField: 'password'
	},
	(login, password, callback) => {
		UserModel.findOne({ login: login }, (err, user) => {
			if (err) { return callback(err); }

			// No user found with that login
			if (!user) { return callback(null, false); }

			// Make sure the password is correct
			user.verifyPassword(password, (err, isMatch) => {
				if (err) { return callback(err); }

				// Password did not match
				if (!isMatch) { return callback(null, false); }

				// Success
				return callback(null, user);
			});
		});
	}
));


passport.use(new BearerStrategy((token, cb) => {
	return AuthModel.findOne({token: token}).exec()
		.then(auth => {
			if (!auth) { return cb(null, false); }
			return cb(null, {
				token: auth.token,
				data: auth.user
			});
		})
		.catch(err => (
			cb(err)
		));
}));


passport.serializeUser((user, cb) => {
	cb(null, user.id);
});


passport.deserializeUser((id, cb) => {
	UserModel.findById(id, (err, user) => {
		if (err) { return cb(err); }
		cb(null, user);
	});
});


module.exports.passport = passport;
module.exports.loginUser = passport.authenticate('local', { session : false });
module.exports.isAuth = passport.authenticate('bearer', { session : false });


module.exports.generateToken = (req, res, next) => {
	const token = jwt.sign({ id: req.user.id }, 'bbuttons with nodejs');
	UserModel.findById(req.user.id).exec()
		.then(user => (
			AuthModel({
				token: token,
				user: user
			}).save()
		))
		.then(() => {
			req.token = token;
			next();
		});
};


module.exports.respond = (req, res) => {
	res.json(presenter.success({
		user: req.user,
		token: req.token
	}));
};


module.exports.logout = (req, res) => {
	AuthModel.remove({token: req.user.token})
		.then(() => {
			res.json(presenter.success(null));
		});
};