'use strict';


const express      = require('express');
const auth         = require('../controllers/auth');

const router = express.Router();

router.post('/login', auth.loginUser, auth.generateToken, auth.respond);
router.get('/logout', auth.isAuth, auth.logout);

module.exports = router;