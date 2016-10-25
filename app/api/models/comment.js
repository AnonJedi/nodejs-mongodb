'use strict';


var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var commentSchema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		required: true,
		unique: true,
		index: true 
	},
	author: Schema.Types.Mixed,
	post_id: {
		type: Schema.Types.ObjectId,
		index: true,
		required: true
	},
	likes: [{ user_id: {
		type: Schema.Types.ObjectId,
		index: true
	}}]
}, { autoIndex: false });



module.exports = mongoose.model('comment', commentSchema);