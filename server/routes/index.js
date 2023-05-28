const Router = require('express').Router();

const authRoute = require('./authRoute');
const userRoute = require('./userRoute');
const productRoute = require('./productRoute');

//Rutas
Router.use('/auth', authRoute);
Router.use('/users', userRoute);
Router.use('/products', productRoute);

module.exports = Router;
