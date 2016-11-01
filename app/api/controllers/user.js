'use strict';


const userService        = require('../services/user');
const presenter          = require('../presenters/presenter');
const validators         = require('../validators/user');


//Getting list of all users
module.exports.getAllUsers = (req, res) => {
	userService.getAllUsers()
		.then(users => {
			res.json(presenter.success(users));
		})
		.catch(err => {
			console.log(err);
			res.json(presenter.fail(err, 'Error occurred while fetching user list'));
		});
};


//Getting user by user id
module.exports.getUser = (req, res) => {
	//Validation of user id
	if (!validateObjectId(req.params.userId)) {
		const err = `User id '${req.params.userId}' is not valid`;
		console.log(err);
		res.json(presenter.fail(null, err));
		return;
	}

	//Fetch user if user id is valid
	userService.getUser(req.params.userId)
		.then(user => {
			res.json(presenter.success(user));
		})
		.catch(err => {
			console.log(err);
			res.json(presenter.fail(err, 'Error occurred while fetching user'));
		});
};


//Creation new user
module.exports.createUser = (req, res) => {
	//Validation of user data like
	//login, password, firstname, lastname
	const parsedData = validateCreateUser(req.body);
	if (parsedData.err) {
		console.log('User creation error:', parsedData.err);
		res.json(presenter.fail(null, parsedData.err));
		return;
	}

	//Create user if data are valid
	userService.createUser(parsedData)
		.then(user => {
			res.json(presenter.success(user));
		})
		.catch(err => {
			console.log(err);
			res.json(presenter.fail(err, 'Error occurred while creating user'));
		});
};


//Create following for user
module.exports.createFollower = (req, res) => {
	//Validate user id and following user id
	let err;
	if (!commonValidator.validateObjectId(req.params.userId)) {
		err.userId = 'User id is not valid';
	}
	if (!commonValidator.validateObjectId(req.params.followingUserId)) {
		err.followingUserId = 'Following user id is not valid';
	}

	if (err) {
		console.log('Error of follower creation.', err);
		res.json(presenter.fail(null, err));
		return;
	}

	//Create link between users if ids are valid
	userService.createFollower(req.params.userId, req.params.followingUserId)
		.then(() => {
			res.json(presenter.success(null));
		})
		.catch(err => {
			console.log(err);
			res.json(presenter.fail(err, 'Error occurred while creating follower'));
		});
};


//Removing following for user
module.exports.removeFollower = (req, res) => {
	//Validate user id and following user id
	let err;
	if (!commonValidator.validateObjectId(req.params.userId)) {
		err.userId = 'User id is not valid';
	}
	if (!commonValidator.validateObjectId(req.params.followingUserId)) {
		err.followingUserId = 'Following user id is not valid';
	}

	if (err) {
		console.log('Error of follower remove.', err);
		res.json(presenter.fail(null, err));
		return;
	}

	//Remove link between users if ids are valid
	userService.removeFollower(req.params.userId, req.params.followingUserId)
		.then(() => {
			res.json(presenter.success(null));
		})
		.catch(err => {
			console.log(err);
			res.json(presenter.fail(err, 'Error occurred while deleting follower'));
		});
};


//Deleting user
module.exports.deleteUser = (req, res) => {
	//Validate user id
	if (!commonValidator.validateObjectId(req.params.userId)) {
		var err = `User id '${req.params.userId}' is not valid`;
		console.log(err);
		res.json(presenter.fail(null, err));
		return;
	}

	//Delete user if his id is valid
	userService.removeUser(req.user.id, req.params.userId)
		.then(() => {
			res.json(presenter.success(null));
		})
		.catch((err) => {
			console.log(err);
			presenter.fail(err, 'Error occurred while deleting user');
		})
};