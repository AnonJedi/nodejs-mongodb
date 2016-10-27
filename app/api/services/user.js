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


module.exports.createFollower = function(userId, followingUserId) {	
	var followingUser;
	return _checkEqualsIdsPromise(userId, followingUserId, 'User cannot follow to himself')
		.then(function() {
			return UserModel.findById(followingUserId).exec();
		})
		.then(function(user) {
			if(!user) {
				throw new ServiceException(`Followed user with id - "${followingUserId}" is not found`);
			}
			followingUser = user;
			return UserModel.findById(userId).exec();
		})
		.then(function(user) {
			return StreamModel.findByIdAndUpdate(followingUser.stream_id, {
				$push: {
					followers: {
						stream_id: user.stream_id
					}
				}
			});
		})
};


module.exports.removeFollower = function(userId, followedUserId) {
	var followingUser;
	return _checkEqualsIdsPromise(userId, followedUserId, 'User cannot unfollow to himself')
		.then(function() {
			return UserModel.findById(followedUserId).exec();
		})
		.then(function(user) {
			if(!user) {
				throw new ServiceException(`Followed user with id - "${followedUserId}" is not found`);
			}
			followingUser = user;
			return UserModel.findById(userId).exec();
		})
		.then(function(user) {
			return StreamModel.findByIdAndUpdate(followingUser.stream_id, {
				$pull: {
					followers: {
						stream_id: user.stream_id
					}
				}
			});
		})
};


function _checkEqualsIdsPromise(firstId, secondId, rejectMessage) {
	return new Promise(function(resolve, reject) {
		if (firstId === secondId) {
			reject(new ServiceException(rejectMessage));
		}
		resolve();
	});
}