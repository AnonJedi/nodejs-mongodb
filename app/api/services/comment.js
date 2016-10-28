'use strict';


var CommentModel       = require('../models/comment'),
    UserModel          = require('../models/user'),
    PostModel          = require('../models/post'),
    constants          = require('../constants'),
    ServiceException   = require('../exceptions/service-exception');


module.exports.getCommentsPreview = function (postId) {
    return CommentModel.find({post_id: postId})
        .sort({created_at: -1})
        .limit(constants.previewCommentsCount)
        .exec()
        .then(function (comments) {
            return new Promise(function (resolve) {
                var compareByDate = _compareObjects.bind(null, 'created_at');
                resolve(comments.sort(compareByDate));
            })
        })
};


module.exports.createComment = function (authorizedUserId, userId, postId, text) {
    var user, post;

    return new Promise(function (resolve, reject) {
        if (authorizedUserId !== userId) {
            reject(new ServiceException('User cannot comment post as another user'));
        }
        if (!text || !text.trim()) {
            reject(new ServiceException('Comment text cannot be empty'));
        }
        resolve();
    })
        .then(function () {
            return UserModel.findById(userId).exec();
        })
        .then(function (dbUser) {
            user = dbUser;
            return PostModel.findById(postId).exec();
        })
        .then(function (dbPost) {
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
        .then(function(comment) {
            return new Promise(function (resolve) {
                resolve({
                    post: post,
                    comment: comment
                });
            });
        });
};


function _compareObjects(field, a, b) {
    if (a[field] < b[field]) {
        return -1;
    }
    if (a[field] > b[field]) {
        return 1;
    }
    return 0;
}