const express = require('express');
const router = express.Router();

const { getUsers, getOneUser, deleteUser, updateUser } = require('../controller/userController');

router.get('/get-users', getUsers);
router.get('/get/:id', getOneUser);
router.delete('/delete/:id', deleteUser);
router.put('/update/:id', updateUser)

module.exports = router;