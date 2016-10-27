'use strict';


var express           = require('express'),
    auth              = require('../controllers/auth');

var router = express.Router();

router.post('/login', auth.loginUser, auth.generateToken, auth.respond);
router.get('/logout', auth.isAuth, auth.logout);

module.exports = router;