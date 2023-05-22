const AsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { authMiddleware } = require("./authMiddleware");
const jwt = require("jsonwebtoken");

const roleMiddleware = (role) => {
  return AsyncHandler(async (req, res, next) => {
    if (req.user.role === "admin") return next();
    if (role !== req.user.role) {
      res.statusCode = 401;
      throw new Error("No tienes los permisos necesarios para continuar");
    }
    next();
  });
};

module.exports = { roleMiddleware };
