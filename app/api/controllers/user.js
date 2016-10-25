'use strict';


var userService        = require('../services/user'),
    ServiceException   = require('../exceptions/service-exception');


module.exports.getAllUsers = function(req, res) {
	userService.getAllUsers()
		.then(function(users) {
			res.json({
				success: true,
				error: null,
				data: users
			});
		})
		.catch(function(err) {
			console.log(err);
			res.json({
				success: false,
				error: 'Error occurred while fetching user list',
				data: null
			});
		});
}


module.exports.createUser = function(req, res) {
	userService.createUser(req.body)
		.then(function(user) {
			res.json({
				success: true,
				error: null,
				data: user
			});
		})
		.catch(function(err) {
			console.log(err);
			var error;
			if (err instanceof ServiceException) {
				error = err.message;
			} else {
				error = 'Error occurred while creating user';
			}
			res.json({
				success: false,
				error: error,
				data: null
			})
		});
}