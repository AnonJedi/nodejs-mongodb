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


authSchema.index({token: 1});


const Model = module.exports = mongoose.model('auths', authSchema);


Model.ensureIndexes(err => {
  if (err) console.log(err);
});