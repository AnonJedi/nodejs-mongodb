'use strict';


const CommentModel = require('../models/comment');
const UserModel = require('../models/user');
const PostModel = require('../models/post');
const constants = require('../constants');
const ServiceException = require('../exceptions/service-exception');


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


module.exports.getCommentList = (postId, size, offset) => {
    let comments, post;

    return PostModel.findById(postId).exec()
        .then(dbPost => {
            if (!dbPost) {
                throw new ServiceException(`Post with id '${postId}' is not found`);
            }
            post = dbPost;
            return CommentModel.find({post_id: postId})
                .sort('created_at')
                .skip(offset * size)
                .limit(size)
                .exec()
        })
        .then(dbComments => {
            comments = dbComments;
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
            if (!comment.author._id == userId) {
                throw new ServiceException(`Comment with id '${commentId}' is 
                    not belong to user with id '${userId}'`);
            }
            comment.text = text;
            return comment.save();
        })
);


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
            let isCommentInPostPreview = post.comments.filter(item => item.comment._id.equals(commentId));
            if (isCommentInPostPreview.length) {
                return _refreshCommentsOfPost(post);
            }
            return new Promise(resolve => { resolve(post) });
        })
        .then(data => {
            return new Promise(resolve => {
                resolve({
                    post: data
                });
            });
        });
};


const _refreshCommentsOfPost = post => (
    CommentModel.find({post_id: post._id})
        .sort({created_at: -1})
        .limit(constants.previewCommentsCount)
        .exec()
        .then(comments => {
            const sorting = _compareObjects.bind(null, 'created_at');
            post.comments = comments.sort(sorting).map(comment => ({comment: comment}));
            return post.save();
        })
);