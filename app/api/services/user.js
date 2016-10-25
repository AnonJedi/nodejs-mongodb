'use strict';


var UserModel          = require('../models/user'),
    StreamModel        = require('../models/stream'),
    ServiceException   = require('../exceptions/service-exception'),
    bcrypt             = require('bcrypt');


module.exports.getAllUsers = function() {
	return UserModel.find().exec();
}

module.exports.createUser = function(userData) {
	var getHashPromise = new Promise(function(resolve, reject) {
		bcrypt.hash(userData.password, 10, function(err, hash) {
			if (err) {
				console.log(err, `\nPassword is - ${password}`);
				throw 'Something wrong with password';
			}
			resolve(hash);
		})
	})

	var newUser = new UserModel({
		login: userData.login,
		firstname: userData.firstname,
		lastname: userData.lastname
	});

	return UserModel.findOne({login: userData.login}).exec()
		.then(function(user) {
			if (user) {
				throw new ServiceException(`User with login ${userData.login} already exists`);
			}
			var newStream = new StreamModel({});
			
			return newStream.save();
		})
		.then(function(newStream) {
			newUser.stream_id = newStream._id;
			return getHashPromise;
		})
		.then(function(hash) {
			newUser.password = hash;
			return newUser.save();
		})
		.catch(function(err) {
			console.log(err);
			if (err instanceof ServiceException) {
				throw err;
			}
			throw new ServiceException('Error occurred while creating user', err);
		});
}
