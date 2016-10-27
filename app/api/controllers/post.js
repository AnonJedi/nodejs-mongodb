'use strict';


var postService        = require('../services/post'),
    presenter          = require('../presenters/presenter');


module.exports.createPost = function(req, res) {
    if (req.user.id != req.params.userId) {
        res.json(presenter.failWithData({
                postUserId: req.params.userId,
                authorizedUserId: req.user.id
            }, 'User cannot create post for another user'));
    } else {
        postService.createPost(req.user.id, req.body.text)
            .then(function(data) {
                res.json(presenter.success({
                    user: data.user,
                    post: data.post
                }));
            })
            .catch(function(err) {
                console.log(err);
                res.json(presenter.fail(err, 'Error occurred while creating new post'));
            })
    }

};