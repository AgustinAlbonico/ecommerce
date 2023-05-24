const Router = require("express").Router();

const authRoute = require("./authRoute");
const userRoute = require("./userRoute");
const productRoute = require("./productRoute");

//Rutas
Router.use("/auth", authRoute);
Router.use("/user", userRoute);
Router.use("/product", productRoute);

module.exports = Router;
