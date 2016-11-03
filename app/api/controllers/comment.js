'use strict';


const commentService = require('../services/comment');
const presenter = require('../presenters/presenter');
const validator = require('../validators/comment');
const commonValidator = require('../validators/common');


module.exports.createComment = (req, res) => {
  const rawData = {
    authorizedUserId: req.user.id,
    userId: req.params.userId,
    postId: req.params.postId,
    text: req.body.text
  };
  const parsedData = validator.validateCreateCommentData(rawData);
  if (Object.keys(parsedData.err).length) {
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


module.exports.getComment = (req, res) => {
  if (!commonValidator.validateObjectId(req.params.commentId)) {
    const err = `Comment id '${req.params.commentId}' is not valid`;
    console.log(err);
    res.json(presenter.fail(null, err));
    return;
  }

  commentService.getComment(req.params.commentId)
    .then(data => {
      res.json(presenter.success(data));
    })
    .catch(err => {
      console.log(err);
      res.json(presenter.fail(err, 'Error occurred while getting comment'));
    });
};


module.exports.getCommentsPage = (req, res) => {
  const rawData = Object.assign(req.query, {
    userId: req.params.userId,
    postId: req.params.postId
  });
  const parsedData = validator.validateGetCommentListData(rawData);
  if (Object.keys(parsedData.err).length) {
    console.log('Cannot get comments list.', parsedData.err);
    res.json(presenter.fail(null, parsedData.err));
    return;
  }

  commentService.getCommentList(parsedData.postId, parsedData.size, parsedData.offset)
    .then(data => {
      res.json(presenter.success(data));
    })
    .catch(err => {
      console.log(err);
      res.json(presenter.fail(err, 'Error occurred while fetching comments list'));
    })
};


module.exports.editComment = (req, res) => {
  const rawData = {
    authorizedUserId: req.user.id,
    userId: req.params.userId,
    commentId: req.params.commentId,
    text: req.body.text
  };
  const parsedData = validator.validateEditCommentData(rawData);
  if (Object.keys(parsedData.err).length) {
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
  if (Object.keys(parsedData.err).length) {
    console.log('Cannot delete comments', parsedData.err);
    res.json(presenter.fail(null, parsedData.err));
    return;
  }
  commentService.deleteComment(parsedData.userId, parsedData.commentId)
    .then((data) => {
      res.json(presenter.success(data));
    })
    .catch(err => {
      console.log(err);
      res.json(presenter.fail(err, 'Error occurred while deleting comment'));
    });
};


module.exports.postCommentLike = (req, res) => {
  const rawData = {
    userId: req.params.userId,
    authorizedUserId: req.user.id,
    commentId: req.params.commentId
  };

  const parsedData = validator.validateTogglePostLikeData(rawData);

  commentService.toggleCommentLike(parsedData.userId, parsedData.commentId)
    .then(data => {
      res.json(presenter.success(data));
    })
    .catch(err => {
      console.log(err);
      res.json(presenter.fail(err, 'Error occurred while toggling comment like'));
    });
};