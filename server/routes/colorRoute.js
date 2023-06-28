const express = require('express');
const {
  createColor,
  updateColor,
  deleteColor,
  getColor,
  getallColor,
} = require('../controller/colorController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');
const ROLES = require('../config/roles');
const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(ROLES.admin), createColor);
router.put('/:id', authMiddleware, roleMiddleware(ROLES.admin), updateColor);
router.delete('/:id', authMiddleware, roleMiddleware(ROLES.admin), deleteColor);
router.get('/:id', getColor);
router.get('/', getallColor);

module.exports = router;
