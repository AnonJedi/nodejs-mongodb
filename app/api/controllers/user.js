'use strict';


var userService        = require('../services/user'),
	presenter          = require('../presenters/presenter');


module.exports.getAllUsers = function(req, res) {
	userService.getAllUsers()
		.then(function(users) {
			res.json(presenter.success(users));
		})
		.catch(function(err) {
			console.log(err);
			res.json(presenter.fail(err, 'Error occurred while fetching user list'));
		});
};


module.exports.getUser = function(req, res) {
	userService.getUser(req.params.userId)
		.then(function(user) {
			res.json(presenter.success(user));
		})
		.catch(function(err) {
			console.log(err);
			res.json(presenter.fail(err, 'Error occurred while fetching user'));
		});
};


module.exports.createUser = function(req, res) {
	userService.createUser(req.body)
		.then(function(user) {
			res.json(presenter.success(user));
		})
		.catch(function(err) {
			console.log(err);
			res.json(presenter.fail(err, 'Error occurred while creating user'));
		});
};


module.exports.createFollower = function(req, res) {
	userService.createFollower(req.params.userId, req.params.followingUserId)
		.then(function() {
			res.json(presenter.success(null));
		})
		.catch(function(err) {
			console.log(err);
			res.json(presenter.fail(err, 'Error occurred while creating follower'));
		});
};


module.exports.removeFollower = function(req, res) {
	userService.removeFollower(req.params.userId, req.params.followingUserId)
		.then(function() {
			res.json(presenter.success(null));
		})
		.catch(function(err) {
			console.log(err);
			res.json(presenter.fail(err, 'Error occurred while deleting follower'));
		});
};


module.exports.deleteUser = function(req, res) {
	userService.removeUser(req.user.id, req.params.userId)
		.then(function() {
			res.json(presenter.success(null));
		})
		.catch(function(err) {
			console.log(err);
			presenter.fail(err, 'Error occurred while deleting user');
		})
};