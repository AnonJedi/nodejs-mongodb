'use strict';


var express           = require('express'),
    post              = require('../controllers/post'),
    isAuth            = require('../controllers/auth').isAuth;

var router = express.Router({ mergeParams: true });

router.get('/', isAuth, post.getPosts);
router.post('/new', isAuth, post.createPost);


module.exports = router;