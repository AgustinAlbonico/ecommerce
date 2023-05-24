const router = require('express').Router();

const {
  createProduct,
  getOneProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require('../controller/productController');

const roles = require('../config/roles');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

//Rutas
router.post('/', authMiddleware, roleMiddleware(roles.admin), createProduct);
router.put('/:id', authMiddleware, roleMiddleware(roles.admin), updateProduct);
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(roles.admin),
  deleteProduct
);
router.get('/:id', getOneProduct);
router.get('/', getProducts);

module.exports = router;
