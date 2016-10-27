'use strict';


var ServiceException = require('../exceptions/service-exception');


module.exports.success = function(data) {
    return {
        success: true,
        error: null,
        data: data
    }
};


module.exports.fail = function(err, msg) {
    var error;
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


module.exports.failWithData = function(data, msg) {
    return {
        success: false,
        error: msg,
        data: data
    }
};