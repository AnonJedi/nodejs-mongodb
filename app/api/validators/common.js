'use strict';


var isValidObjectId = require('mongoose').Types.ObjectId.isValid;


module.exports.validateObjectId = userId => (
    isValidObjectId(userId)
);