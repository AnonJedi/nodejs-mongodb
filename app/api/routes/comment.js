'use strict';


const comment      = require('../controllers/comment');
const isAuth       = require('../controllers/auth').isAuth;

const router       = require('express').Router({ mergeParams: true });


router.post('/posts/:postId/comments/new', isAuth, comment.createComment);
router.get('/comments/:commentId', isAuth, comment.getComment);
router.get('/posts/:postId/comments', isAuth, comment.getCommentsPage);
router.post('/comments/:commentId', isAuth, comment.editComment);


module.exports = router;