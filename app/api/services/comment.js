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


module.exports.createComment = (authorizedUserId, userId, postId, text) => {
    let user, post;

    return new Promise((resolve, reject) => {
        if (authorizedUserId !== userId) {
            reject(new ServiceException('User cannot comment post as another user'));
        }
        if (!text || !text.trim()) {
            reject(new ServiceException('Comment text cannot be empty'));
        }
        resolve();
    })
        .then(() => UserModel.findById(userId).exec())
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
        .then(comment => (
            new Promise(resolve => {
                resolve({
                    post: post,
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