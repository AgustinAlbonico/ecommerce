const express = require('express');
const router = express.Router();

const {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getBrands,
} = require('../controller/brandController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');
const ROLES = require('../config/roles');

router.post('/', authMiddleware, roleMiddleware(ROLES.admin), createBrand);
router.put('/:id', authMiddleware, roleMiddleware(ROLES.admin), updateBrand);
router.get('/:id', authMiddleware, getBrand);
router.get('/', authMiddleware, getBrands);
router.delete('/:id', authMiddleware, roleMiddleware(ROLES.admin), deleteBrand);

module.exports = router;
