const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');



const User = require('../models/user');
const jwt = require("jsonwebtoken");

router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.delete('/remove/:userId', checkAuth, UserController.user_remove);

module.exports = router;