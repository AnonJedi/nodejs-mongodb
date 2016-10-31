'use strict';


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