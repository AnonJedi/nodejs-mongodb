'use strict';

const router            = require('express').Router();
const userController    = require('../controllers/user');
const isAuth            = require('../controllers/auth').isAuth;


router.get('/', userController.getAllUsers);
router.post('/new', userController.createUser);
router.get('/:userId', userController.getUser);
router.post('/:userId/follow/:followingUserId', userController.createFollower);
router.delete('/:userId/unfollow/:followingUserId', userController.removeFollower);
router.delete('/:userId', userController.deleteUser);


module.exports = router;