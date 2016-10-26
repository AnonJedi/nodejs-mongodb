'use strict';


var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
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



module.exports = mongoose.model('users', userSchema);