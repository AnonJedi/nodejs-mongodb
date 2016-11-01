'use strict';


const commonValidator   = require('./common');


module.exports.validateCreatePostData = data => {
    let parsedData = {};

    if (data.authorizedUserId != data.userId) {
        parsedData.err.authorizedUserId = 'User cannot create post for another user';
    }
    if (!commonValidator.validateObjectId(data.userId)) {
        parsedData.err.userId = `User id '${data.userId}' is not valid`;
    }
    parsedPata.userId = data.userId;

    if (!data.text || !data.text.trim()) {
        parsedData.err.text = 'Post text cannot be empty';
    }
    parsedData.text = data.text;

    return parsedData;
};


module.exports.validateGetPostListQuery = data => {
    let parsedData = {};
    if (!data.size) {
        parsedData.err.size = 'Query size is undefined.';
    } else {
        parsedData.size = Number.parseInt(data.size);
        if (!parsedData.size) {
            parsedData.err.size = 'Size parameter is not valid. Need integer number';
        }
    }

    if (!data.offset) {
        parsedData.err.offset = 'Query offset is undefined.';
    } else {
        parsedData.size = Number.parseInt(data.offset);
        if (!parsedData.offset) {
            parsedData.err.offset = 'Offset parameter is not valid. Need integer number';
        }
    }

    return parsedData;
};


module.exports.validateEditPostData = data => {
    let parsedData = {};
    if (!data.text || !data.text.trim()) {
        parsedData.err.text = 'New text cannot be empty';
    }
    parsedData.text = data.text;

    if (data.authorizedUserId != data.userId) {
        parsedData.err.authorizedUserId = 'User cannot edit posts of another users';
    }

    if (!commonValidator.validateObjectId(data.userId)) {
        parsedData.err.userId = `User id '${data.userId}' is not valid`;
    }

    parsedData.userId = data.userId;

    if (!commonValidator.validateObjectId(data.postId)) {
        parsedData.err.postId = `Post id '${data.postId}' is not valid`
    }

    parsedData.postId = data.postId;

    return parsedData;
};


module.exports.validateDeletionOfPost = data => {
    let parsedData = {};
    if (data.authorizedUserId != data.userId) {
        parsedData.err.authorizedUserId = 'User cannot remove posts of another users';
    }

    if (!commonValidator.validateObjectId(data.userId)) {
        parsedData.err.userId = `User id '${data.userId}' is not valid`;
    }
    parsedData.userId = data.userId;

    if (!commonValidator.validateObjectId(data.postId)) {
        parsedData.err.postId = `Post id '${data.postId}' is not valid`;
    }
    parsedData.postId = data.postId;
    return parsedData;
};


module.exports.validateTogglePostLikeData = function (data) {
    var parsedData = {};
    if (data.authorizedUserId != data.userId) {
        parsedData.err.authorizedUserId = 'User cannot set likes as another user';
    }

    if (!commonValidator.validateObjectId(data.userId)) {
        parsedData.err.userId = `User id '${data.userId}' is not valid`;
    }
    parsedData.userId = data.userId;

    if (!commonValidator.validateObjectId(data.postId)) {
        parsedData.err.postId = `Post id '${data.postId}' is not valid`;
    }
    parsedData.postId = data.postId;

    return parsedData;
};