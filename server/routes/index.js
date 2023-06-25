const Router = require('express').Router();

const authRoute = require('./authRoute');
const userRoute = require('./userRoute');
const productRoute = require('./productRoute');
const blogRoute = require('./blogRoute');
const prodCatRoute = require('./prodCatRoute');
const blogCatRoute = require('./blogCatRoute');
const brandRoute = require('./brandRoute');
const couponRoute = require('./couponRoute');
const colorRoute = require('./colorRoute');

//Rutas
Router.use('/auth', authRoute);
Router.use('/users', userRoute);
Router.use('/products', productRoute);
Router.use('/blogs', blogRoute);
Router.use('/prod-category', prodCatRoute);
Router.use('/blog-category', blogCatRoute);
Router.use('/brand', brandRoute);
Router.use('/coupon', couponRoute);
Router.use('/color', colorRoute);

module.exports = Router;
