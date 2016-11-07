'use strict';


const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
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
	},
	comments: [{comment: Schema.Types.Mixed}]
}, { autoIndex: false });


const Model = module.exports = mongoose.model('posts', postSchema);


Model.ensureIndexes(err => {
	if (err) console.log(err);
});