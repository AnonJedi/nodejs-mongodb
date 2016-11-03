'use strict';


const passport        = require('passport');
const LocalStrategy   = require('passport-local').Strategy;
const jwt             = require('jsonwebtoken');
const expressJwt      = require('express-jwt');
const blacklist       = require('express-jwt-blacklist');
const UserModel       = require('../models/user');
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
module.exports.isAuth = expressJwt({ secret: 'bbuttons with nodejs' });

module.exports.generateToken = (req, res, next) => {
	req.token = jwt.sign({ id: req.user.id }, 'bbuttons with nodejs', {
		expiresIn: '1d'
	});
	next();
};


module.exports.respond = (req, res) => {
	res.json(presenter.success({
		user: req.user,
		token: req.token
	}));
};


module.exports.isRevokedCallback = (req, payload, done) => {
	const issuer = payload.iss;
	const tokenId = payload.jti;

	data.getRevokedToken(issuer, tokenId, (err, token) => {
		if (err) { return done(err); }
		return done(null, !!token);
	});
};


module.exports.logout = (req, res) => {
	blacklist.revoke(req.user);
	res.json(presenter.success(null));
};