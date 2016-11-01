'use strict';


const postService       = require('../services/post');
const presenter         = require('../presenters/presenter');
const validator         = require('../validators/post');
const commonValidator   = require('../validators/common');


module.exports.createPost = (req, res) => {
    const rawData = {
        authorizedUserId: req.user.id,
        userId: req.params.userId,
        text: req.body.text
    };
    const parsedData = validator.validateCreatePostData(rawData);
    if (parsedData.err) {
        console.log('Cannot create new post.', parsedData.err);
        res.json(presenter.fail(null, parsedData.err));
        return;
    }

    postService.createPost(parsedData.userId, parsedData.text)
        .then((data) => {
            res.json(presenter.success({
                user: data.user,
                post: data.post
            }));
        })
        .catch((err) => {
            console.log(err);
            res.json(presenter.fail(err, 'Error occurred while creating new post'));
        });
};


module.exports.getPosts = (req, res) => {
    //Validate and parse data for getting post list
    const parsedData = validator.validateGetPostListQuery(req.query);

    //Validate user id
    if (!commonValidator.validateObjectId(req.params.userId)) {
        parsedData.err.userId = `User id '${req.params.userId}' is not valid`;
    }

    //If data contains 'err' field after validation -> send fail response
    if (parsedData.err) {
        console.log('Cannot get post list.', parsedData.err);
        res.json(presenter.fail(null, parsedData.err));
        return;
    }
    parsedData.userId = req.params.userId;

    //If all validation is done fetch posts
    postService.getPostList(parsedData.userId, parsedData.size, parsedData.offset, parsedData.sort)
        .then(data => {
            res.json(presenter.success(data));
        })
        .catch(err => {
            console.log(err);
            res.json(presenter.fail(err, 'Error occurred while fetching post list. Check the params'));
        });
};


module.exports.editPost = (req, res) => {
    //Get all data for validation
    const rawData = {
        text: req.body.text,
        userId: req.params.userId,
        authorizedUserId: req.user.id,
        postId: req.params.postId
    };

    const parsedData = validator.validateEditPostData(rawData);

    //If parsed data contain 'err' field -> send fail response
    if (parsedData.err) {
        console.log('Cannot edit post.', parsedData.err);
        res.json(presenter.fail(null, parsedData.err));
        return;
    }

    //Edit post if validation is success
    postService.editPost(parsedData)
        .then(data => {
            res.json(presenter.success(data));
        })
        .catch(err => {
            console.log(err);
            res.json(presenter.fail(err, 'Error occurred while updating post'));
        });
};


module.exports.deletePost = (req, res) => {
    //Get all data for validation
    const rawData = {
        authorizedUserId: req.user.id,
        userId: req.params.userId,
        postId: req.params.postId
    };
    const parsedData = validator.validateDeletionOfPost(rawData);

    //If parsed data contain 'err' field -> send fail response
    if (parsedData.err) {
        console.log('Cannot delete post.', parsedData.err);
        res.json(presenter.fail(null, parsedData.err));
        return;
    }

    //Delete post if validation is success
    postService.deletePost(parsedData.userId, parsedData.postId)
        .then(() => {
            res.json(presenter.success(null));
        })
        .catch(err => {
            console.log(err);
            res.json(presenter.fail(err, 'Error occurred while deleting post'));
        });
};


module.exports.togglePostLike = (req, res) => {
    //Get all data for validation
    const rawData = {
        authorizedUserId: req.user.id,
        userId: req.params.userId,
        postId: req.params.postId
    };
    const parsedData = validator.validateTogglePostLikeData(rawData);

    //If parsed data contain 'err' field -> send fail response
    if (parsedData.err) {
        console.log('Cannot toggle like.', parsedData.err);
        res.json(presenter.fail(null, parsedData.err));
        return;
    }

    postService.togglePostLike(parsedData.userId, parsedData.postId)
        .then(data => {
            res.json(presenter.success(data));
        })
        .catch(err => {
            console.log(err);
            res.json(presenter.fail(err, 'Error occurred while toggling like to post'));
        });
};