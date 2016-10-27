'use strict';


var passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    jwt             = require('jsonwebtoken'),
    expressJwt      = require('express-jwt'),
    UserModel       = require('../models/user');


passport.use(new LocalStrategy(
	{
		usernameField: 'login',
		passwordField: 'password'
	},
	function(login, password, callback) {
		UserModel.findOne({ login: login }, function (err, user) {
			if (err) { return callback(err); }

			// No user found with that login
			if (!user) { return callback(null, false); }

			// Make sure the password is correct
			user.verifyPassword(password, function(err, isMatch) {
				if (err) { return callback(err); }

				// Password did not match
				if (!isMatch) { return callback(null, false); }

				// Success
				return callback(null, user);
			});
		});
	}
));

passport.serializeUser(function(user, cb) {
	cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
	UserModel.findById(id, function (err, user) {
		if (err) { return cb(err); }
		cb(null, user);
	});
});


module.exports.passport = passport;
module.exports.loginUser = passport.authenticate('local', { session : false });
module.exports.isAuth = expressJwt({ secret: 'bbuttons with nodejs' });

module.exports.generateToken = function(req, res, next) {
	req.token = jwt.sign({ id: req.user.id }, 'bbuttons with nodejs', {
		expiresIn: '7d'
	});
	next();
};


module.exports.respond = function(req, res) {
	res.json({
		success: true,
		error: null,
		data: {
			user: req.user,
			token: req.token
		}
	});
};


module.exports.logout = function(req, res) {
	delete req.user;
	res.json({
		success: true,
		error: null,
		data: null
	})
};


module.exports.unauthHandler = function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		res.json({
			success: false,
			error: `${err.name}: ${err.message}`,
			data: null
		})
	}
};