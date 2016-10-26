'use strict';

var express           = require('express'),
	userController    = require('../controllers/user'),
    isAuth            = require('../controllers/auth').isAuth;

var router = express.Router();

router.get('/', isAuth, userController.getAllUsers);
router.post('/new', isAuth, userController.createUser);
router.post('/:userId/follow/:followingUserId', isAuth, userController.createFollower);
router.post('/:userId/unfollow/:followingUserId', isAuth, userController.removeFollower);


module.exports = router;