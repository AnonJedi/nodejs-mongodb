'use strict';


const ServiceException = require('../exceptions/service-exception');


module.exports.success = data => (
    {
        success: true,
        error: null,
        data: data
    }
);


module.exports.fail = (err, msg) => {
    let error;
    if (err instanceof ServiceException) {
        error = err.message;
    } else {
        error = msg;
    }
    return {
        success: false,
        error: error,
        data: null
    }
};