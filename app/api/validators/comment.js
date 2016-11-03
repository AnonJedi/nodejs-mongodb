'use strict';


const commonValidator = require('./common');


module.exports.validateCreateCommentData = data => {
    const parsedData = {
        err: {}
    };

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
    const parsedData = {
        err: {}
    };

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
    const parsedData = {
        err: {}
    };

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


module.exports.validateGetCommentListData = data => {
    const parsedData = commonValidator.validatePageQueryData(data);

    if (!commonValidator.validateObjectId(data.postId)) {
        parsedData.err.postId = `Post id '${data.postId}' is not valid`;
    }
    parsedData.postId = data.postId;

    return parsedData;
};