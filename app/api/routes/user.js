'use strict';

var express           = require('express'),
	userController    = require('../controllers/user'),
    isAuth            = require('../controllers/auth').isAuth;

var router = express.Router();

router.get('/', isAuth, userController.getAllUsers);
router.post('/new', isAuth, userController.createUser);
router.get('/:userId', isAuth, userController.getUser);
router.post('/:userId/follow/:followingUserId', isAuth, userController.createFollower);
router.delete('/:userId/unfollow/:followingUserId', isAuth, userController.removeFollower);
router.delete('/:userId', isAuth, userController.deleteUser);


module.exports = router;