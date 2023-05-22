const express = require("express");
const router = express.Router();

const {
  createUser,
  loginUser,
  logoutUser,
  isAuth,
  handleRefreshToken,
} = require("../controller/userController");

router.post("/register", createUser);

router.post("/login", loginUser);

router.get("/logout", logoutUser);

router.get("/is-auth", isAuth);

router.get("/refresh", handleRefreshToken);

module.exports = router;
