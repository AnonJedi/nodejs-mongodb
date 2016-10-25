'use strict';

var express           = require('express'),
	userController    = require('../controllers/user');

var router = express.Router();

router.get('/', userController.getAllUsers);
router.post('/new', userController.createUser);

module.exports = router;