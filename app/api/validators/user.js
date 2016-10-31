'use strict';


var isValidObjectId = require('mongoose').Types.ObjectId.isValid;


module.exports.createUser = function (data) {
    if (!data) {
        return 'User data is required';
    }

    var fields = ['login', 'password', 'firstname', 'lastname'];

    var errors;

    fields.forEach(function (field) {
        if (!data[field]) {
            errors[field] = `${field} is required`;
        }
    });
    return errors;
};


module.exports.validateUserId = function (userId) {
    return isValidObjectId(userId);
};