'use strict';


module.exports.validateCreateUser = data => {
    const parsedData = {
        err: {}
    };
    if (!data) {
        parsedData.err.data = 'User data is required';
    }

    const fields = ['login', 'password', 'firstname', 'lastname'];

    fields.forEach(field => {
        if (!data[field] || !data[field].trim()) {
            parsedData.err[field] = `${field} is required`;
        }
        parsedData[field] = data[field];
    });

    return parsedData;
};
