const express = require('express');
const router = express.Router();

const {
  getUsers,
  getOneUser,
  deleteUser,
  updateUser,
  blockOrUnblockUser,
  updatePassword,
} = require('../controller/userController');

const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

const ROLES = require('../config/roles');

//RUTAS
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
router.put('/password', updatePassword);

module.exports = router;
