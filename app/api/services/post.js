'use strict';


var PostModel          = require('../models/post'),
    StreamModel        = require('../models/stream'),
    UserModel          = require('../models/user'),
    constants          = require('../constants'),
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


module.exports.getPostList = function(userId, queryData) {

    var sorting = constants.postSorting[queryData.sort] || constants.postSorting.date;

    var posts, user;

    return new Promise(function(resolve, reject) {
        var error;
        if (!queryData.size) {
            error = 'Query size is undefined. ';
        }

        if (!queryData.offset) {
            error += 'Query offset is undefined.';
        }

        if (error) {
            reject(new ServiceException(error));
        }

        resolve();
    })
        .then(function() {
            return UserModel.findById(userId).exec();
        })
        .then(function(dbUser) {
            user = dbUser;
            return PostModel.find({
                $or: [{
                    stream_id: dbUser.stream_id
                }, {
                    'followers.stream_id': dbUser.stream_id
                }]
            })
                .sort(sorting)
                .skip(queryData.size * queryData.offset)
                .limit(queryData.size)
                .exec()
        })
        .then(function(dbPosts) {
            posts = dbPosts;
            return PostModel.find({$or: [{stream_id: user.stream_id}, {followers: user.stream_id}]})
                .count()
                .exec()
        })
        .then(function(count) {
            return new Promise(function(resolve) {
                resolve({
                    posts: posts,
                    count: count,
                    user: user,
                    offset: queryData.offset,
                    size: queryData.size,
                    sort: queryData.sort || 'date'
                });
            })
        })
};