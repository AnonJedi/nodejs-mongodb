'use strict';


var UserModel          = require('../models/user'),
    StreamModel        = require('../models/stream'),
    ServiceException   = require('../exceptions/service-exception'),
    bcrypt             = require('bcrypt');


module.exports.getAllUsers = function() {
	return UserModel.find().exec();
};


module.exports.getUser = function (userId) {
	return UserModel.findById(userId).exec();
};


module.exports.createUser = function(userData) {
	var getHashPromise = new Promise(function(resolve, reject) {
		bcrypt.hash(userData.password, 10, function(err, hash) {
			if (err) {
				console.log(err, `\nPassword is - ${password}`);
				reject(new ServiceException('Something wrong with password', err));
			}
			resolve(hash);
		})
	});

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
};


module.exports.createFollower = function(userId, trackedUserId) {
	var trackedUser;
	return _isDiffIds(userId, trackedUserId, 'User cannot follow to himself')
		.then(function() {
			return UserModel.findById(trackedUserId).exec();
		})
		.then(function(user) {
			if(!user) {
				throw new ServiceException(`User with id - "${trackedUserId}" is not found`);
			}
			trackedUser = user;
			return UserModel.findById(userId).exec();
		})
		.then(function(user) {
			return StreamModel.findByIdAndUpdate(trackedUser.stream_id, {
				$push: {
					followers: {
						stream_id: user.stream_id
					}
				}
			});
		})
};


module.exports.removeFollower = function(userId, trackedUserId) {
	var trackedUser;
	return _isDiffIds(userId, trackedUserId, 'User cannot subscribe to himself')
		.then(function() {
			return UserModel.findById(trackedUserId).exec();
		})
		.then(function(user) {
			if(!user) {
				throw new ServiceException(`User with id - "${trackedUserId}" is not found`);
			}
			trackedUser = user;
			return UserModel.findById(userId).exec();
		})
		.then(function(user) {
			return StreamModel.findByIdAndUpdate(trackedUser.stream_id, {
				$pull: {
					followers: {
						stream_id: user.stream_id
					}
				}
			});
		})
};


function _isDiffIds(firstId, secondId, rejectMessage) {
	return new Promise(function(resolve, reject) {
		if (firstId === secondId) {
			reject(new ServiceException(rejectMessage));
		}
		resolve();
	});
}


module.exports.removeUser = function(authUserId, removedUserId) {
	return new Promise(function(resolve, reject) {
		if (authUserId != removedUserId) {
			reject(new ServiceException('Authorized user cannot remove another user'));
		}
		resolve();
	})
		.then(function() {
			UserModel.findById(removedUserId).remove();
		});
};