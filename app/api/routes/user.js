'use strict';

var express           = require('express'),
	userController    = require('../controllers/user');

var router = express.Router();

router.get('/', userController.getAllUsers);
router.post('/new', userController.createUser);
router.post('/:userId/follow/:followingUserId', userController.createFollower);

module.exports = router;