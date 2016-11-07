'use strict';


const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
	author: Schema.Types.Mixed,
	post_id: {
		type: Schema.Types.ObjectId,
		index: true,
		required: true
	},
	likes: [{ user_id: {
		type: Schema.Types.ObjectId,
		index: true
	}}],
	created_at: {
		type : Date,
		default: Date.now
	},
	text: {
		type: String,
		required: true
	}
}, { autoIndex: false });


const Model = module.exports = mongoose.model('comments', commentSchema);


Model.ensureIndexes(err => {
	if (err) console.log(err);
});