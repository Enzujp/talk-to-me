const express = require("express");
const router = express.Router();

const userController = require("../controllers/authController");

router.get('/signup', userController.signup_get);

router.post('/signup', userController.signup_post);

router.get('/signin', userController.signin_get);

router.post('signin', userController.signin_post);

router.get('logout', userController.logout_get);


module.exports = router;