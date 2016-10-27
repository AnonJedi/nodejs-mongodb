'use strict';


var PostModel          = require('../models/post'),
    StreamModel        = require('../models/stream'),
    UserModel          = require('../models/user'),
    ServiceException   = require('../exceptions/service-exception');

module.exports.createPost = function (userId, postText) {
    var userData;
    return UserModel.findById(userId).exec()
        .then(function(user) {
            if (!user) {
                throw new ServiceException(`User with id ${userId} is not found`);
            }
            userData = user;
            return StreamModel.findById(user.stream_id).exec();
        })
        .then(function (stream) {
            var newPost = new PostModel({
                text: postText,
                followers: stream.followers,
                stream_id: stream._id
            });
            return newPost.save();
        })
        .then(function(newPost) {
            return new Promise(function(resolve) {
                if (newPost) {
                    resolve({ user: userData, post: newPost });
                }
            })
        })
};