'use strict';

const router            = require('express').Router();
const userController    = require('../controllers/user');
const isAuth            = require('../controllers/auth').isAuth;


router.get('/', isAuth, userController.getAllUsers);
router.post('/new', userController.createUser);
router.get('/:userId', isAuth, userController.getUser);
router.post('/:userId/follow/:followingUserId', isAuth, userController.createFollower);
router.delete('/:userId/unfollow/:followingUserId', isAuth, userController.removeFollower);
router.delete('/:userId', isAuth, userController.deleteUser);


module.exports = router;