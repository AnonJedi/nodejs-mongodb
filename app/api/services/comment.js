'use strict';


const CommentModel       = require('../models/comment');
const UserModel          = require('../models/user');
const PostModel          = require('../models/post');
const constants          = require('../constants');
const ServiceException   = require('../exceptions/service-exception');


module.exports.getCommentsPreview = postId => (
    CommentModel.find({post_id: postId})
        .sort({created_at: -1})
        .limit(constants.previewCommentsCount)
        .exec()
        .then(comments => (
            new Promise(resolve => {
                const compareByDate = _compareObjects.bind(null, 'created_at');
                resolve(comments.sort(compareByDate));
            })
        ))
);


module.exports.createComment = (userId, postId, text) => {
    let user, post;

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
        .then(comment => {
            if (post.comments.length == constants.previewCommentsCount) {
                post.comments.shift();
            }
            return post.comments.push(comment).save();
        })
        .then(updatedPost => (
            new Promise(resolve => {
                resolve({
                    post: updatedPost,
                    comment: updatedPost.comments[constants.previewCommentsCount-1]
                });
            })
        ));
};


const _compareObjects = (field, a, b) => {
    if (a[field] < b[field]) {
        return -1;
    }
    if (a[field] > b[field]) {
        return 1;
    }
    return 0;
};


module.exports.editComment = (userId, commentId, text) => (
    CommentModel.findById(commentId).exec()
        .then(comment => {
            if (!comment.author._id.equal(userId)) {
                throw new ServiceException(`Comment with id '${commentId}' is 
                    not belong to user with id '${userId}'`);
            }
            comment.text = text;
            return comment.save();
        })
);


module.exports.deleteComment = (userId, commentId) => (
    CommentModel.findById(commentId).exec()
        .then(comment => {
            if (!comment) {
                throw new ServiceException(`Comment with id '${commentId}' is not found`);
            }

            if (!comment.author._id.equal(userId)) {
                throw new ServiceException('User cannot delete comments of another user');
            }

            return comment.remove();
        })
);