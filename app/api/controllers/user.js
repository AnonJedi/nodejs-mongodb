'use strict';


var userService        = require('../services/user'),
	presenter          = require('../presenters/presenter'),
	validators         = require('../validators/user');


//Getting list of all users
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


//Getting user by user id
module.exports.getUser = function(req, res) {
	//Validation of user id
	if (!validators.validateUserId(req.params.userId)) {
		var err = `User id '${req.params.userId}' is not valid`;
		console.log(err);
		res.json(presenter.fail(null, err));
		return;
	}

	//Fetch user if user id is valid
	userService.getUser(req.params.userId)
		.then(function(user) {
			res.json(presenter.success(user));
		})
		.catch(function(err) {
			console.log(err);
			res.json(presenter.fail(err, 'Error occurred while fetching user'));
		});
};


//Creation new user
module.exports.createUser = function(req, res) {
	//Validation of user data like
	//login, password, firstname, lastname
	var err = validators.createUser(req.body);
	if (err) {
		console.log('User creation error:', err);
		res.json(presenter.fail(null, err));
		return;
	}

	//Create user if data are valid
	userService.createUser(req.body)
		.then(function(user) {
			res.json(presenter.success(user));
		})
		.catch(function(err) {
			console.log(err);
			res.json(presenter.fail(err, 'Error occurred while creating user'));
		});
};


//Create following for user
module.exports.createFollower = function(req, res) {
	//Validate user id and following user id
	var err;
	if (!validators.validateUserId(req.params.userId)) {
		err.userId = 'User id is not valid';
	}
	if (!validators.validateUserId(req.params.followingUserId)) {
		err.followingUserId = 'Following user id is not valid';
	}

	if (err) {
		console.log('Error of follower creation.', err);
		res.json(presenter.fail(null, err));
		return;
	}

	//Create link between users if ids are valid
	userService.createFollower(req.params.userId, req.params.followingUserId)
		.then(function() {
			res.json(presenter.success(null));
		})
		.catch(function(err) {
			console.log(err);
			res.json(presenter.fail(err, 'Error occurred while creating follower'));
		});
};


//Removing following for user
module.exports.removeFollower = function(req, res) {
	//Validate user id and following user id
	var err;
	if (!validators.validateUserId(req.params.userId)) {
		err.userId = 'User id is not valid';
	}
	if (!validators.validateUserId(req.params.followingUserId)) {
		err.followingUserId = 'Following user id is not valid';
	}

	if (err) {
		console.log('Error of follower remove.', err);
		res.json(presenter.fail(null, err));
		return;
	}

	//Remove link between users if ids are valid
	userService.removeFollower(req.params.userId, req.params.followingUserId)
		.then(function() {
			res.json(presenter.success(null));
		})
		.catch(function(err) {
			console.log(err);
			res.json(presenter.fail(err, 'Error occurred while deleting follower'));
		});
};


//Deleting user
module.exports.deleteUser = function(req, res) {
	//Validate user id
	if (!validators.validateUserId(req.params.userId)) {
		var err = `User id '${req.params.userId}' is not valid`;
		console.log(err);
		res.json(presenter.fail(null, err));
		return;
	}

	//Delete user if his id is valid
	userService.removeUser(req.user.id, req.params.userId)
		.then(function() {
			res.json(presenter.success(null));
		})
		.catch(function(err) {
			console.log(err);
			presenter.fail(err, 'Error occurred while deleting user');
		})
};