'use strict';


const express      = require('express');
const post         = require('../controllers/post');
const isAuth       = require('../controllers/auth').isAuth;

const router = express.Router({ mergeParams: true });

router.post('/new', isAuth, post.createPost);
router.get('/', isAuth, post.getPosts);
router.get('/:postId', isAuth, post.getPost);
router.put('/:postId', isAuth, post.editPost);
router.delete('/:postId', isAuth, post.deletePost);
router.post('/:postId/like', isAuth, post.togglePostLike);


module.exports = router;