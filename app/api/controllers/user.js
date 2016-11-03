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
	const parsedData = validators.validateCreateUserData(req.body);
	if (Object.keys(parsedData.err).length) {
		console.log('User creation error:', parsedData.err);
		res.json(presenter.fail(null, parsedData.err));
		return;
	}

	//Create user if data are valid
	userService.createUser(parsedData.login, parsedData.password, parsedData.firstname, parsedData.lastname)
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
	const rawData = {
		authorizedUserId: req.user.id,
		userId: req.params.userId,
		trackedUserId: req.params.followingUserId
	};
	const parsedData = validators.validateFollowData(rawData);

	if (Object.keys(parsedData.err).length) {
		console.log('Error of follower remove.', parsedData.err);
		res.json(presenter.fail(null, parsedData.err));
		return;
	}

	//Create link between users if ids are valid
	userService.createFollower(parsedData.userId, parsedData.trackedUserId)
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
	const rawData = {
		authorizedUserId: req.user.id,
		userId: req.params.userId,
		trackedUserId: req.params.followingUserId
	};
	const parsedData = validators.validateFollowData(rawData);

	if (Object.keys(parsedData.err).length) {
		console.log('Error of follower remove.', parsedData.err);
		res.json(presenter.fail(null, parsedData.err));
		return;
	}

	//Remove link between users if ids are valid
	userService.removeFollower(parsedData.userId, parsedData.trackedUserId)
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
	const rawData = {
		userId: req.params.userId,
		authorizedUserId: req.user.id
	};

	const parsedData = validators.validateDeleteUserData(rawData);

	if (Object.keys(parsedData.err).length) {
		console.log(parsedData.err);
		res.json(presenter.fail(null, parsedData.err));
		return;
	}

	//Delete user if his id is valid
	userService.removeUser(parsedData.userId)
		.then(() => {
			res.json(presenter.success(null));
		})
		.catch((err) => {
			console.log(err);
			presenter.fail(err, 'Error occurred while deleting user');
		})
};