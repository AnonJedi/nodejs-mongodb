'use strict';


var UserModel = require('../models/user');


function getAllUsers() {
	return UserModel.find({}, function(err, docs) {
		if (err) {
			console.log(err);
			return;
		}

		return docs;
	});
}

exports.getAllUsers = getAllUsers;