'use strict';


const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const authSchema = new Schema({
  token: {
    type: String,
    index: true,
    required: true
  },
  user: {
    type: Schema.Types.Mixed,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('auths', authSchema);