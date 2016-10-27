'use strict';


var postService        = require('../services/post'),
    ServiceException   = require('../exceptions/service-exception');


module.exports.createPost = function(req, res) {
    if (req.user.id != req.params.userId) {
        res.json({
            success: false,
            error: 'User cannot create post for another user',
            data: {
                postUserId: req.params.userId,
                authorizedUserId: req.user.id
            }
        })
    } else {
        postService.createPost(req.user.id, req.body.text)
            .then(function(data) {
                res.json({
                    success: true,
                    error: null,
                    data: {
                        user: data.user,
                        post: data.post
                    }
                });
            })
            .catch(function(err) {
                console.log(err);
                var error;
                if (err instanceof ServiceException) {
                    error = err.message;
                } else {
                    error = 'Error occurred while creating new post';
                }
                res.json({
                    success: false,
                    error: error,
                    data: null
                })
            })
    }

};