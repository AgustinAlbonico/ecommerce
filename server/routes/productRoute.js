const router = require('express').Router();

const {
  createProduct,
  getOneProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  addToWishList,
  rating,
  uploadImages,
  deleteImages,
} = require('../controller/productController');

const { uploadPhoto, productImgResize } = require('../middleware/uploadImage');

const ROLES = require('../config/roles');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

//RUTAS
router.put('/rating', authMiddleware, rating);
router.put(
  '/images',
  authMiddleware,
  roleMiddleware(ROLES.admin),
  uploadPhoto.array('images', 10),
  productImgResize,
  uploadImages
);
router.delete(
  '/images/:id',
  authMiddleware,
  roleMiddleware(ROLES.admin),
  deleteImages
);
router.put('/wishlist', authMiddleware, addToWishList);
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(ROLES.admin),
  deleteProduct
);
router.post('/', authMiddleware, roleMiddleware(ROLES.admin), createProduct);
router.put('/:id', authMiddleware, roleMiddleware(ROLES.admin), updateProduct);
router.get('/:id', getOneProduct);
router.get('/', getProducts);

module.exports = router;
