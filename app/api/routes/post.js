'use strict';


const express      = require('express');
const post         = require('../controllers/post');
const isAuth       = require('../controllers/auth').isAuth;

const router = express.Router({ mergeParams: true });

router.post('/new', post.createPost);
router.get('/', post.getPosts);
router.get('/:postId', post.getPost);
router.put('/:postId', post.editPost);
router.delete('/:postId', post.deletePost);
router.post('/:postId/like', post.togglePostLike);


module.exports = router;