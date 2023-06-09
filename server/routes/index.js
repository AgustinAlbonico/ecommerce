const Router = require('express').Router();

const authRoute = require('./authRoute');
const userRoute = require('./userRoute');
const productRoute = require('./productRoute');
const blogRoute = require('./blogRoute');
const categoryRoute = require('./categoryRoute');

//Rutas
Router.use('/auth', authRoute);
Router.use('/users', userRoute);
Router.use('/products', productRoute);
Router.use('/blogs', blogRoute);
Router.use('/category', categoryRoute);

module.exports = Router;
