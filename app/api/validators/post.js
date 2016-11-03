'use strict';


const commonValidator   = require('./common');


module.exports.validateCreatePostData = data => {
    const parsedData = {
        err: {}
    };
    if (data.authorizedUserId != data.userId) {
        parsedData.err.authorizedUserId = 'User cannot create post for another user';
    }
    if (!commonValidator.validateObjectId(data.userId)) {
        parsedData.err.userId = `User id '${data.userId}' is not valid`;
    }

    parsedData.userId = data.userId;

    if (!data.text || !data.text.trim()) {
        parsedData.err.text = 'Post text cannot be empty';
    }
    parsedData.text = data.text;

    return parsedData;
};


module.exports.validateGetPostListQuery = data => {
    const parsedData = commonValidator.validatePageQueryData(data);

    if (!commonValidator.validateObjectId(data.userId)) {
        parsedData.err.userId = `User id '${data.userId}' is not valid`;
    }
    parsedData.userId = data.userId;

    return parsedData;
};


module.exports.validateEditPostData = data => {
    const parsedData = {
        err: {}
    };
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
    const parsedData = {
        err: {}
    };
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
    const parsedData = {
        err: {}
    };
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