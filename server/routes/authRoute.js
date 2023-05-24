const express = require('express');
const router = express.Router();

const {
  createUser,
  loginUser,
  logoutUser,
  isAuth,
  handleRefreshToken,
  updatePassword,
} = require('../controller/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/register', createUser);

router.post('/login', loginUser);

router.get('/logout', logoutUser);

router.get('/is-auth', isAuth);

router.get('/refresh', handleRefreshToken);

router.put('/password', authMiddleware, updatePassword);

module.exports = router;
