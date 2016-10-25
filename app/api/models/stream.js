'use strict';


var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var streamSchema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		required: true,
		unique: true,
		index: true 
	},
	followers: [{ stream_id: {
		type: Schema.Types.ObjectId,
		index: true
	}}]
}
// , { autoIndex: false }
);



module.exports = mongoose.model('streams', streamSchema);