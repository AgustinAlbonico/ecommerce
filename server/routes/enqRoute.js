const express = require('express');
const {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getallEnquiry,
} = require('../controller/enqController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');
const ROLES = require('../config/roles');
const router = express.Router();

router.post('/', createEnquiry);
router.put('/:id', authMiddleware, roleMiddleware(ROLES.admin), updateEnquiry);
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(ROLES.admin),
  deleteEnquiry
);
router.get('/:id', getEnquiry);
router.get('/', getallEnquiry);

module.exports = router;
