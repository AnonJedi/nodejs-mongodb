'use strict';


var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var postSchema = new Schema({
	text: {
		type: String,
		required: true
	},
	stream_id: {
		type: Schema.Types.ObjectId,
		index: true,
		required: true
	},
	followers: [{ stream_id: {
		type: Schema.Types.ObjectId,
		index: true
	}}],
	likes: [{ user_id: {
		type: Schema.Types.ObjectId,
		index: true
	}}],
	created_at: {
		type : Date,
		default: Date.now
	}
}, { autoIndex: false });



module.exports = mongoose.model('posts', postSchema);