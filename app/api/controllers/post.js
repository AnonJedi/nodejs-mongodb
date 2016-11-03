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
    if (Object.keys(parsedData.err).length) {
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


module.exports.getPost = (req, res) => {
    if (!commonValidator.validateObjectId(req.params.postId)) {
        const err = `Post id '${req.params.postId}' is not valid`;
        console.log(err);
        res.json(presenter.fail(null, err));
        return;
    }

    postService.getPost(req.params.postId)
        .then(data => {
            res.json(presenter.success(data));
        })
        .catch(err => {
            console.log(err);
            res.json(presenter.fail(err, 'Error occurred while getting post'));
        });
};


module.exports.getPosts = (req, res) => {
    const rawData = Object.assign(req.query, {userId: req.params.userId});
    //Validate and parse data for getting post list
    const parsedData = validator.validateGetPostListQuery(rawData);

    //If data contains 'err' field after validation -> send fail response
    if (Object.keys(parsedData.err).length) {
        console.log('Cannot get post list.', parsedData.err);
        res.json(presenter.fail(null, parsedData.err));
        return;
    }

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
    if (Object.keys(parsedData.err).length) {
        console.log('Cannot edit post.', parsedData.err);
        res.json(presenter.fail(null, parsedData.err));
        return;
    }

    //Edit post if validation is success
    postService.editPost(parsedData.userId, parsedData.postId, parsedData.text)
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
    if (Object.keys(parsedData.err).length) {
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
    if (Object.keys(parsedData.err).length) {
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