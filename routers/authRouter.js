const express = require('express');
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  createNewPassword,
} = require('./../controllers/authController');

const {
  registerValidation,
  loginValidation,
} = require('./../middlewares/joiSchema');

router.post('/auth/register', registerValidation, register);
router.post('/auth/login', loginValidation, login);
router.post('/auth/forgot_password', forgotPassword);

router.post('/auth/reset_password', resetPassword);
router.post('/auth/create_newPassword', createNewPassword);

module.exports = router;
