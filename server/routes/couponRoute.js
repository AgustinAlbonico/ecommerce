const express = require('express');
const router = express.Router();
const ROLES = require('../config/roles');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

const {
  createCoupon,
  updateCoupon,
  getCoupon,
  getCoupons,
  deleteCoupon,
} = require('../controller/couponController');

router.post('/', authMiddleware, roleMiddleware(ROLES.admin), createCoupon);

router.put('/:id', authMiddleware, roleMiddleware(ROLES.admin), updateCoupon);

router.get('/:id', authMiddleware, getCoupon);
router.get('/', authMiddleware, getCoupons);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(ROLES.admin),
  deleteCoupon
);

module.exports = router;
