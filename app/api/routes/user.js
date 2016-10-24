'use strict';

var express        = require('express'),
	userService    = require('../services/user');

var router = express.Router();


router.get('/', function(req, res) {
	var users = userService.getAllUsers();
	if (users) {
		res.json({
			success: true,
			error: null,
			data: users
		});
	} else {
		res.json({
			success: false,
			error: 'Error occurred while fetching users',
			data: null
		});
	}
});

module.exports = router;