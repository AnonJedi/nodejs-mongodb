'use strict';


const commentService    = require('../services/comment');
const presenter         = require('../presenters/presenter');
const validator         = require('../validators/comment');


module.exports.createComment = (req, res) => {
    const rawData = {
        authorizedUserId: req.user.id,
        userId: req.params.userId,
        postId: req.params.postId,
        text: req.body.text
    };
    const parsedData = validator.validateCreateCommentData(rawData);
    if (parsedData.err) {
        console.log('Cannot create comment.', parsedData.err);
        req.json(presenter.fail(null, parsedData.err));
        return;
    }

    commentService.createComment(parsedData.userId, parsedData.postId, parsedData.text)
        .then(data => {
            res.json(presenter.success(data));
        })
        .catch(err => {
            console.log(err);
            res.json(presenter.fail(err, 'Error occurred while creating comment'));
        });
};


module.exports.editComment = (req, res) => {
    const rawData = {
        authorizedUserId: req.user.id,
        userId: req.params.userId,
        commentId: req.params.commentId,
        text: req.body.text
    };
    const parsedData = validator.validateEditCommentData(rawData);
    if (parsedData.err) {
        console.log('Cannot edit comment.', parsedData.err);
        res.json(presenter.fail(null, parsedData.err));
        return;
    }

    commentService.editComment(parsedData.userId, parsedData.commentId, parsedData.text)
        .then(data => {
            res.json(presenter.success(data));
        })
        .catch(err => {
            console.log(err);
            res.json(presenter.fail(err, 'Error occurred while editing comment'));
        });
};


module.exports.deleteComment = (req, res) => {
    const rawData = {
        authorizedUserId: req.user.id,
        userId: req.params.userId,
        commentId: req.params.commentId
    };
    const parsedData = validator.validateDeletionCommentData(rawData);

    commentService.deleteComment(parsedData.userId, parsedData.commentId)
        .then(() => {
            res.json(presenter.success(null));
        })
        .catch(err => {
            console.log(err);
            res.json(presenter.fail(err, 'Error occurred while deleting comment'));
        });
};