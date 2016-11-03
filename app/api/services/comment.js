'use strict';


const CommentModel = require('../models/comment');
const UserModel = require('../models/user');
const PostModel = require('../models/post');
const constants = require('../constants');
const ServiceException = require('../exceptions/service-exception');


/**
 * Function for getting single comment by id
 * @param commentId - mongoose type ObjectId
 * @returns {Promise.<Object>}  - object like
 *                                {
 *                                  post: post of comment,
 *                                  comment: founded comment
 *                                }
 */
module.exports.getComment = commentId => {
  let comment;
  return CommentModel.findById(commentId).exec()
    .then(dbComment => {
      if (!dbComment) {
        throw new ServiceException(`Comment with id '${commentId}' is not found`);
      }
      comment = dbComment;
      return PostModel.findById(comment.post_id).exec();
    })
    .then(post => (
      new Promise(resolve => {
        resolve({
          post: post,
          comment: comment
        })
      })
    ));
};


/**
 * Function for getting comments list of post
 * @param postId - id of post of comments, mongoose type ObjectId
 * @param size - size of query page, Integer
 * @param offset - offset in pages, Integer
 * @returns {Promise.<Object>} - object like
 *                               {
 *                                 post: post of comments,
 *                                 comments: list of comments,
 *                                 size: size,
 *                                 offset: offset,
 *                                 count: total comments count
 *                               }
 */
module.exports.getCommentList = (postId, size, offset) => {
  let comments, post;

  return PostModel.findById(postId).exec()
    .then(dbPost => {
      if (!dbPost) {
        throw new ServiceException(`Post with id '${postId}' is not found`);
      }
      post = dbPost;

      //Build query for page of data
      return CommentModel.find({post_id: postId})
        .sort('created_at')
        .skip(offset * size)
        .limit(size)
        .exec()
    })
    .then(dbComments => {
      comments = dbComments;

      //Get total count of comments
      return CommentModel.find({post_id: postId})
        .count()
        .exec();
    })
    .then(count => (
      new Promise(resolve => {
        resolve({
          post: post,
          comments: comments,
          size: size,
          offset: offset,
          count: count
        })
      })
    ));
};


/**
 * Function for creation new comment
 * @param userId - id of comment author, mongoose type ObjectId
 * @param postId - id of parent post, mongoose type ObjectId
 * @param text - body of comment, String
 * @returns {Promise.<Object>} - object like
 *                               {
 *                                 post: parent post,
 *                                 comment: created comment
 *                               }
 */
module.exports.createComment = (userId, postId, text) => {
  let user, post, comment;

  return UserModel.findById(userId).exec()
    .then(dbUser => {
      user = dbUser;
      return PostModel.findById(postId).exec();
    })
    .then(dbPost => {
      if (!dbPost) {
        throw new ServiceException(`Post with id ${postId} is not found`);
      }
      post = dbPost;
      return new CommentModel({
        post_id: postId,
        text: text,
        author: user
      }).save();
    })
    .then(dbComment => {
      comment = dbComment;

      //If post's preview comments count is lower than need then push new comment into post's
      // comments preview otherwise shift preview and push add new comment
      if (post.comments.length == constants.previewCommentsCount) {
        post.comments.shift();
      }
      post.comments.push({comment: comment});
      return post.save();
    })
    .then(updatedPost => (
      new Promise(resolve => {
        resolve({
          post: updatedPost,
          comment: comment
        });
      })
    ));
};


/**
 * Function for edit comment
 * @param userId - id of author, mongoose type ObjectId
 * @param commentId - id of edited comment, mongoose type ObjectId
 * @param text - new comment text, String
 * @returns {Promise.<Object>} - new comment object
 */
module.exports.editComment = (userId, commentId, text) => (
  CommentModel.findById(commentId).exec()
    .then(comment => {
      if (!comment.author._id == userId) {
        throw new ServiceException(`Comment with id '${commentId}' is 
                    not belong to user with id '${userId}'`);
      }
      comment.text = text;
      return comment.save();
    })
);


/**
 * Function for deleting comment
 * @param userId - id of author, mongoose type ObjectId
 * @param commentId - id of deleting comment, mongoose type ObjectId
 * @returns {Promise.<Object>} - parent post of deleted comment
 */
module.exports.deleteComment = (userId, commentId) => {
  let post, comment;
  return CommentModel.findById(commentId).exec()
    .then(dbComment => {
      if (!dbComment) {
        throw new ServiceException(`Comment with id '${commentId}' is not found`);
      }

      if (!dbComment.author._id == userId) {
        throw new ServiceException('User cannot delete comments of another user');
      }
      comment = dbComment;
      return PostModel.findById(comment.post_id).exec();
    })
    .then(dbPost => {
      if (!dbPost) {
        return CommentModel.remove({post_id: comment.post_id});
      }
      post = dbPost;
      return comment.remove();
    })
    .then(() => {
      //If deleted comment is in post's comments preview then
      //refresh preview otherwise just delete comment
      let isCommentInPostPreview = post.comments.filter(item => item.comment._id.equals(commentId));
      if (isCommentInPostPreview.length) {
        return _refreshCommentsOfPost(post);
      }
      return new Promise(resolve => {
        resolve(post)
      });
    })
    .then(data => {
      return new Promise(resolve => {
        resolve({
          post: data
        });
      });
    });
};


/**
 * Function for refresh post's comments preview
 * @param post - post object
 * @private
 */
const _refreshCommentsOfPost = post => (
  //Get last N comments
  CommentModel.find({post_id: post._id})
    .sort({created_at: -1})
    .limit(constants.previewCommentsCount)
    .exec()
    .then(comments => {
      //And put it to post's comments preview
      const sorting = _compareObjects.bind(null, 'created_at');
      post.comments = comments.sort(sorting).map(comment => ({comment: comment}));
      return post.save();
    })
);


/**
 * Function helper for sorting array of objects by field
 * @param field - sorting field, String
 * @param a - first object
 * @param b - second object
 * @returns {number}
 * @private
 */
const _compareObjects = (field, a, b) => {
  if (a[field] < b[field]) {
    return -1;
  }
  if (a[field] > b[field]) {
    return 1;
  }
  return 0;
};


/**
 * Function for toggle like on comment
 * @param userId - id of user which like comment, mongoose type ObjectId
 * @param commentId - id of liked comment, mongoose type ObjectId
 * @returns {Promise.<Object>} - object like
 *                               {
 *                                 user: user which like comment,
 *                                 comment: liked comment
 *                               }
 */
module.exports.toggleCommentLike = (userId, commentId) => {
  let user;
  return UserModel.findById(userId).exec()
    .then(dbUser => {
      user = dbUser;
      return CommentModel.findById(commentId).exec();
    })
    .then(comment => {
      if (!comment) {
        throw new ServiceException(`Comment with id '${commentId}' is not found`);
      }

      //Check user id in comment's likes
      let likeInPost = -1;
      comment.likes.every((item, i) => {
        if (item.user_id.equals(userId)) {
          likeInPost = i;
          return false;
        }
        return true;
      });

      //If not in then just push otherwise pop it
      if (likeInPost === -1) {
        comment.likes.push({user_id: userId});
      } else {
        comment.likes.splice(likeInPost, 1);
      }

      return comment.save();
    })
    .then(comment => (
      new Promise(resolve => {
        resolve({
          user: user,
          comment: comment
        });
      })
    ))
};