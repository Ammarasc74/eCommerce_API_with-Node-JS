const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const User = require('../models/user');

const UserController = require('../controllers/user');

router.get('/users', UserController.user_get_all);

router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login);

router.delete("/:userId", checkAuth, UserController.user_delete_user);

module.exports = router;