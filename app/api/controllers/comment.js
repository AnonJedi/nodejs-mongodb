'use strict';


const commentService    = require('../services/comment');
const presenter         = require('../presenters/presenter');


module.exports.createComment = (req, res) => {
    commentService.createComment(
        req.user.id, req.params.userId,
        req.params.postId, req.body.text)
        .then((data) => {
            res.json(presenter.success(data));
        })
        .catch((err) => {
            console.log(err);
            res.json(presenter.fail(err, 'Error occurred while creating comment'));
        });
};