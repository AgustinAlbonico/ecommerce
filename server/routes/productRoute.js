const router = require('express').Router();

const {
  createProduct,
  getOneProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  addToWishList,
  rating,
} = require('../controller/productController');

const roles = require('../config/roles');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

//RUTAS
router.put('/rating', authMiddleware, rating);
router.put('/wishlist', authMiddleware, addToWishList);
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(roles.admin),
  deleteProduct
);
router.post('/', authMiddleware, roleMiddleware(roles.admin), createProduct);
router.put('/:id', authMiddleware, roleMiddleware(roles.admin), updateProduct);
router.get('/:id', getOneProduct);
router.get('/', getProducts);

module.exports = router;
