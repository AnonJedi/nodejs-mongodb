'use strict';


const commonValidator = require('./common');


module.exports.validateCreateCommentData = data => {
    let parsedData = {};

    if (data.authorizedUserId !== data.userId) {
        parsedData.err.authorizedUserId = 'User cannot comment post as another user';
    }
    if (!commonValidator.validateObjectId(data.userId)) {
        parsedData.err.userId = `User id '${data.userId}' is not valid`;
    }
    parsedData.userId = data.userId;

    if (!commonValidator.validateObjectId(data.postId)) {
        parsedData.err.postId = `Post id '${data.postId}' is not valid`;
    }
    parsedData.postId = data.postId;

    if (!data.text || !data.text.trim()) {
        parsedData.err.text = 'Comment text cannot be empty';
    }

    parsedData.text = data.text;

    return parsedData;
};


module.exports.validateEditCommentData = data => {
    let parsedData = {};

    if (data.authorizedUserId !== data.userId) {
        parsedData.err.authorizedUserId = 'User cannot edit comment of another user';
    }
    if (!commonValidator.validateObjectId(data.userId)) {
        parsedData.err.userId = `User id '${data.userId}' is not valid`;
    }
    parsedData.userId = data.userId;

    if (!commonValidator.validateObjectId(data.commentId)) {
        parsedData.err.commentId = `Comment id '${data.commentId}' is not valid`;
    }
    parsedData.commentId = data.commentId;

    if (!data.text || !data.text.trim()) {
        parsedData.err.text = 'Comment text cannot be empty';
    }

    parsedData.text = data.text;

    return parsedData;
};


module.exports.validateDeletionCommentData = data => {
    let parsedData = {};

    if (data.authorizedUserId !== data.userId) {
        parsedData.err.authorizedUserId = 'User cannot delete comment of another user';
    }
    if (!commonValidator.validateObjectId(data.userId)) {
        parsedData.err.userId = `User id '${data.userId}' is not valid`;
    }
    parsedData.userId = data.userId;

    if (!commonValidator.validateObjectId(data.commentId)) {
        parsedData.err.commentId = `Comment id '${data.commentId}' is not valid`;
    }
    parsedData.commentId = data.commentId;

    return parsedData;
};