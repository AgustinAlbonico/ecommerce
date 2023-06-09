const Router = require('express').Router();

const authRoute = require('./authRoute');
const userRoute = require('./userRoute');
const productRoute = require('./productRoute');
const blogRoute = require('./blogRoute');

//Rutas
Router.use('/auth', authRoute);
Router.use('/users', userRoute);
Router.use('/products', productRoute);
Router.use('/blogs', blogRoute);

module.exports = Router;
