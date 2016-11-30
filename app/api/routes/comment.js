'use strict';


const comment = require('../controllers/comment');
const isAuth = require('../controllers/auth').isAuth;

const router = require('express').Router({mergeParams: true});


router.post('/posts/:postId/comments/new', comment.createComment);
router.get('/comments/:commentId', comment.getComment);
router.get('/posts/:postId/comments', comment.getCommentsPage);
router.put('/comments/:commentId', comment.editComment);
router.delete('/comments/:commentId', comment.deleteComment);
router.post('/comments/:commentId/like', comment.postCommentLike);


module.exports = router;