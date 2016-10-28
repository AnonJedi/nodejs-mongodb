'use strict';


var postService = require('../services/post'),
    presenter = require('../presenters/presenter');


module.exports.createPost = function (req, res) {
    if (req.user.id != req.params.userId) {
        res.json(presenter.failWithData({
            postUserId: req.params.userId,
            authorizedUserId: req.user.id
        }, 'User cannot create post for another user'));
    } else {
        postService.createPost(req.user.id, req.body.text)
            .then(function (data) {
                res.json(presenter.success({
                    user: data.user,
                    post: data.post
                }));
            })
            .catch(function (err) {
                console.log(err);
                res.json(presenter.fail(err, 'Error occurred while creating new post'));
            });
    }
};


module.exports.getPosts = function (req, res) {
    postService.getPostList(req.params.userId, req.query)
        .then(function (data) {
            res.json(presenter.success(data));
        })
        .catch(function (err) {
            console.log(err);
            res.json(presenter.fail(err, 'Error occurred while fetching post list. Check the params'));
        });
};


module.exports.editPost = function (req, res) {
    postService.editPost(req.user.id, req.params.userId, req.params.postId, req.body.text)
        .then(function (data) {
            res.json(presenter.success(data));
        })
        .catch(function (err) {
            console.log(err);
            res.json(presenter.fail(err, 'Error occurred while updating post'));
        });
};


module.exports.deletePost = function (req, res) {
    postService.deletePost(req.user.id, req.params.userId, req.params.postId)
        .then(function () {
            res.json(presenter.success(null));
        })
        .catch(function (err) {
            console.log(err);
            res.json(presenter.fail(err, 'Error occurred while deleting post'));
        });
};


module.exports.togglePostLike = function (req, res) {
    postService.togglePostLike(req.user.id, req.params.userId, req.params.postId)
        .then(function (data) {
            res.json(presenter.success(data));
        })
        .catch(function (err) {
            console.log(err);
            res.json(presenter.fail(err, 'Error occurred while toggling like to post'));
        });
};