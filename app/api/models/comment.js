'use strict';


var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var commentSchema = new Schema({
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



module.exports = mongoose.model('comments', commentSchema);