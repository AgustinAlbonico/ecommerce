const express = require('express');
const router = express.Router();

const {
  getUsers,
  getOneUser,
  deleteUser,
  updateUser,
  blockOrUnblockUser,
  updatePassword,
  saveAdress,
  getWishList,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  getOrders,
  updateOrderStatus,
} = require('../controller/userController');

const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

const ROLES = require('../config/roles');
const { createOrder } = require('../controller/userController');

//RUTAS
router.get('/cart', authMiddleware, getUserCart);
router.post('/cart', authMiddleware, userCart);
router.delete('/cart', authMiddleware, emptyCart);
router.post('/cart/apply-coupon', authMiddleware, applyCoupon);
router.post('/cart/cash-order', authMiddleware, createOrder);
router.get('/orders', authMiddleware, getOrders);
router.put(
  '/orders/:id',
  authMiddleware,
  roleMiddleware(ROLES.admin),
  updateOrderStatus
);

router.get('/', getUsers);
router.get('/:id', authMiddleware, roleMiddleware(ROLES.user), getOneUser);
router.delete('/:id', deleteUser);
router.put('/', authMiddleware, updateUser);
router.put(
  '/blockunblock/:id',
  authMiddleware,
  roleMiddleware(ROLES.admin),
  blockOrUnblockUser
);
router.put('/password', authMiddleware, updatePassword);
router.put('/save-address', authMiddleware, saveAdress);
router.put('/wishlist', authMiddleware, getWishList);

module.exports = router;
