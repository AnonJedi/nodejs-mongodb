'use strict';


var isValidObjectId = require('mongoose').Types.ObjectId.isValid;


module.exports.validateObjectId = userId => (
    isValidObjectId(userId)
);


module.exports.validatePageQueryData = data => {
    let parsedData = {
        err: {}
    };
    if (!data.size) {
        parsedData.err.size = 'Query size is undefined.';
    } else {
        parsedData.size = Number.parseInt(data.size);
        if (!parsedData.size && parsedData.size !== 0) {
            parsedData.err.size = 'Size parameter is not valid. Need integer number';
        }
    }

    if (!data.offset) {
        parsedData.err.offset = 'Query offset is undefined.';
    } else {
        parsedData.offset = Number.parseInt(data.offset);
        if (!parsedData.offset && parsedData.offset !== 0) {
            parsedData.err.offset = 'Offset parameter is not valid. Need integer number';
        }
    }

    return parsedData;
};