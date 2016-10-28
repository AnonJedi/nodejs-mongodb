'use strict';


var commentService    = require('../services/comment'),
    presenter         = require('../presenters/presenter');


module.exports.createComment = function (req, res) {
    commentService.createComment(
        req.user.id, req.params.userId,
        req.params.postId, req.body.text)
        .then(function (data) {
            res.json(presenter.success(data));
        })
        .catch(function (err) {
            console.log(err);
            res.json(presenter.fail(err, 'Error occurred while creating comment'));
        });
};