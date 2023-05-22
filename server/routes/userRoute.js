const express = require("express");
const router = express.Router();

const {
  getUsers,
  getOneUser,
  deleteUser,
  updateUser,
  blockOrUnblockUser,
} = require("../controller/userController");

const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");

const ROLES = require("../config/roles");

router.get("/get-users", getUsers);
router.get("/get/:id", authMiddleware, roleMiddleware(ROLES.user), getOneUser);
router.delete("/delete/:id", deleteUser);
router.put("/update", authMiddleware, updateUser);
router.put(
  "/blockunblock/:id",
  authMiddleware,
  roleMiddleware(ROLES.admin),
  blockOrUnblockUser
);

module.exports = router;
