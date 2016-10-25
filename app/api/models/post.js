'use strict';


var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var postSchema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		required: true,
		unique: true,
		index: true 
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
	}}]
}, { autoIndex: false });



module.exports = mongoose.model('post', postSchema);