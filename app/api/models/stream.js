'use strict';


const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const streamSchema = new Schema({
	followers: [{ stream_id: {
		type: Schema.Types.ObjectId,
		index: true
	}}]
}, { autoIndex: false });


const Model = module.exports = mongoose.model('streams', streamSchema);


Model.ensureIndexes(err => {
	if (err) console.log(err);
});