'use strict';


var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var streamSchema = new Schema({
	followers: [{ stream_id: {
		type: Schema.Types.ObjectId,
		index: true
	}}]
}, { autoIndex: false });



module.exports = mongoose.model('streams', streamSchema);