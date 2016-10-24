var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	_id: {
		type: Schema.ObjectId,
		required: true,
		unique: true 
	}
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
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	follow: [{ user_id: Schema.ObjectId }]
}, { autoIndex: false });



module.exports = mongoose.model('user', userSchema);