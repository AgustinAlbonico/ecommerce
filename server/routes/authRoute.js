const express = require('express');
const router = express.Router();

const {
  createUser,
  loginUser,
  logoutUser,
  isAuth,
  handleRefreshToken,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
} = require('../controller/userController');
const { authMiddleware } = require('../middleware/authMiddleware');
const loginValidator = require('../validator/loginValidator');

//RUTAS
router.post('/register', createUser);
router.post('/login', loginValidator, loginUser);
router.get('/logout', logoutUser);
router.get('/is-auth', isAuth);
router.get('/refresh', handleRefreshToken);
router.put('/password', authMiddleware, updatePassword);
router.post('/forgot-password-token', forgotPasswordToken);
router.put('/reset-password/:token', resetPassword);

module.exports = router;
