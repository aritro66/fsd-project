const express = require('express');
const router = express.Router();

const { loginget, loginpost, forgotpassget, forgotpasspost, forgotpassotp, changepass, signupget, signuppost, signupotp, logout } = require('../controllers/authcontroller');

// login page route get method
router.get('/login', loginget);

// login form data post method
// login data
router.post("/login", loginpost);

// forgotpassword page route get method
router.get('/forgotpassword', forgotpassget);

// forgotpassword form data post method
router.post('/forgotpassword', forgotpasspost);
// checking forgot password otp post method
router.post('/forgotpasswordotp', forgotpassotp);

// changing or giving new password post method
router.post('/changepassword', changepass);

// generating otp while signup
router.post('/otp', signupotp);

// signup page route get method
// signup page
router.get('/signup', signupget);

// getting signup form data
router.post('/signup', signuppost);

router.get('/logout',logout)

module.exports = router;
