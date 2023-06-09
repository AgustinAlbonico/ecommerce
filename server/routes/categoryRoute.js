const router = require('express').Router();

const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategory,
} = require('../controller/categoryController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

const ROLES = require('../config/roles');

router.post('/', authMiddleware, roleMiddleware(ROLES.admin), createCategory);
router.put('/:id', authMiddleware, roleMiddleware(ROLES.admin), updateCategory);
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(ROLES.admin),
  deleteCategory
);
router.get('/', getCategories);
router.get('/:id', getCategory);

module.exports = router;
