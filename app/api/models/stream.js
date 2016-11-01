'use strict';


const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const streamSchema = new Schema({
	followers: [{ stream_id: {
		type: Schema.Types.ObjectId,
		index: true
	}}]
}, { autoIndex: false });



module.exports = mongoose.model('streams', streamSchema);