const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  loginAdmin,
  logoutUser,
  isAuth,
  handleRefreshToken,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  validateEmailToken,
} = require('../controller/userController');
const { authMiddleware } = require('../middleware/authMiddleware');
const loginValidator = require('../validator/loginValidator');

//RUTAS
router.post('/register', registerUser);
router.post('/login', loginValidator, loginUser);
router.post('/admin-login', loginAdmin);
router.get('/logout', logoutUser);
router.get('/is-auth', isAuth);
router.get('/refresh', handleRefreshToken);
router.put('/password', authMiddleware, updatePassword);
router.post('/forgot-password-token', forgotPasswordToken);
router.put('/reset-password/:token', resetPassword);
router.put('/validate-email/:token', validateEmailToken);

module.exports = router;
