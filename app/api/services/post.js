'use strict';


var PostModel = require('../models/post'),
    StreamModel = require('../models/stream'),
    UserModel = require('../models/user'),
    constants = require('../constants'),
    ServiceException = require('../exceptions/service-exception');

module.exports.createPost = function (userId, postText) {
    var userData;
    return UserModel.findById(userId).exec()
        .then(function (user) {
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
        .then(function (newPost) {
            return new Promise(function (resolve) {
                if (newPost) {
                    resolve({user: userData, post: newPost});
                }
            })
        });
};


module.exports.getPostList = function (userId, queryData) {

    var sorting = constants.postSorting[queryData.sort] || constants.postSorting.date;

    var posts, user;

    return new Promise(function (resolve, reject) {
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
        .then(function () {
            return UserModel.findById(userId).exec();
        })
        .then(function (dbUser) {
            user = dbUser;
            if (!user) {
                throw new ServiceException(`User with id ${userId} is not found`);
            }
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
        .then(function (dbPosts) {
            posts = dbPosts;
            return PostModel.find({
                $or: [{
                    stream_id: user.stream_id
                }, {
                    'followers.stream_id': user.stream_id
                }]
            })
                .count()
                .exec()
        })
        .then(function (count) {
            return new Promise(function (resolve) {
                resolve({
                    posts: posts,
                    count: count,
                    user: user,
                    offset: queryData.offset,
                    size: queryData.size,
                    sort: queryData.sort || 'date'
                });
            })
        });
};


module.exports.editPost = function (authorizedUserId, userId, postId, text) {
    var user;
    return new Promise(function (resolve, reject) {
        if (!text || !text.trim()) {
            reject(new ServiceException('New text cannot be empty'));
        }
        if (authorizedUserId != userId) {
            reject(new ServiceException('User cannot edit posts of another users'));
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
        .then(function (post) {
            if (!post) {
                throw new ServiceException(`Post with id ${postId} is not found`);
            }
            if (!user.stream_id.equals(post.stream_id)) {
                throw new ServiceException('User cannot edit posts of another users');
            }
            post.text = text;
            return post.save();
        })
        .then(function (updatedPost) {
            return new Promise(function (resolve) {
                resolve({
                    user: user,
                    post: updatedPost
                });
            })
        });
};


module.exports.deletePost = function (authorizedUserId, userId, postId) {
    var user;
    return new Promise(function (resolve, reject) {
        if (authorizedUserId != userId) {
            reject(new ServiceException('User cannot remove posts of another users'));
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
        .then(function (post) {
            if (!post) {
                throw new ServiceException(`Post with id ${postId} is not found`);
            }
            if (!user.stream_id.equals(post.stream_id)) {
                throw new ServiceException('User cannot edit posts of another users');
            }
            return PostModel.remove({ _id: postId });
        });
};


module.exports.togglePostLike = function (authorizedUserId, userId, postId) {
    var user;
    return new Promise(function (resolve, reject) {
        if (authorizedUserId != userId) {
            reject(new ServiceException('User cannot set likes as another user'));
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
        .then(function (post) {
            if (!post) {
                throw new ServiceException(`Post with id ${postId} is not found`);
            }
            var likeInPost = -1;
            post.likes.forEach(function (item, i) {
                if (item._id.equals(userId)) {
                    likeInPost = i;
                }
            });
            if (likeInPost === -1) {
                post.likes.push(userId);
            } else {
                post.likes.splice(likeInPost, 1);
            }
            return post.save();
        })
        .then(function (updatedPost) {
            return new Promise(function (resolve) {
                resolve({
                    user: user,
                    post: updatedPost
                })
            })
        });
};