const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

//Manera vieja, trabaje con headears en vez de cookies
/*const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?._id);
        
        next();
      }
    } catch (error) {
      throw new Error("Token expirado");
    }
  } else {
    throw new Error("No hay ningun token en el header de la peticion");
  }
});*/

//Misma funcion pero con cookies
const authMiddleware = asyncHandler(async (req, res, next) => {
  let token = req.cookies.access_token;
  if (!token) {
    throw new Error("No hay token de autenticacion, logueate por favor");
  }
  try {
    const { id_user } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id_user);
    console.log(user);
    if (user) {
      req.user = user;

      next();
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { authMiddleware };
