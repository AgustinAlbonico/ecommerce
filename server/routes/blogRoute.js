const express = require('express');
const router = express.Router();

const {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlog,
  getBlogs,
  likeTheBlog,
  dislikeTheBlog,
  uploadImages,
} = require('../controller/blogController');

const { uploadPhoto, blogImgResize } = require('../middleware/uploadImage');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');
const ROLES = require('../config/roles');

router.post('/', authMiddleware, roleMiddleware(ROLES.admin), createBlog);

router.put(
  '/upload/:id',
  authMiddleware,
  roleMiddleware(ROLES.admin),
  uploadPhoto.array('images', 10),
  blogImgResize,
  uploadImages
);

router.put('/likes', authMiddleware, likeTheBlog);
router.put('/dislikes', authMiddleware, dislikeTheBlog);

router.put('/:id', authMiddleware, roleMiddleware(ROLES.admin), updateBlog);

router.get('/:id', authMiddleware, getBlog);
router.get('/', authMiddleware, getBlogs);

router.delete('/:id', authMiddleware, roleMiddleware(ROLES.admin), deleteBlog);

module.exports = router;
