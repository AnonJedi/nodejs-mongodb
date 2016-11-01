'use strict';


const mongoose    = require('mongoose');
const bcrypt      = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	firstname: {
		type: String,
		required: true
	},
	lastname: {
		type: String,
		required: true
	},
	login: {
		type: String,
		required: true,
		unique: true,
		index: true
	},
	password: {
		type: String,
		required: true
	},
	stream_id: {
		type: Schema.Types.ObjectId,
		required: true,
		unique: true
	}
}, { autoIndex: false });

userSchema.methods.verifyPassword = function (password, callback) {
	bcrypt.compare(password, this.password, (err, isMatch) => {
		if (err) {
			return callback(err);
		}
		callback(null, isMatch);
	});
};


module.exports = mongoose.model('users', userSchema);