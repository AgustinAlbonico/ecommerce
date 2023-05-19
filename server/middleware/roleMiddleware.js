const AsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { authMiddleware } = require("./authMiddleware");
const jwt = require("jsonwebtoken");

const roleMiddleware = (role) => {
  return AsyncHandler(async (req, res, next) => {
    if(role !== req.user.role){
        throw new Error('No tienes los permisos necesarios para seguir');
    }
    next();
  });
};

module.exports = { roleMiddleware };
