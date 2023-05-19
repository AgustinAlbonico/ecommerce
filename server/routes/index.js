const Router = require('express').Router();

const authRoute = require('./authRoute');
const userRoute = require('./userRoute');

//Rutas
Router.use('/auth', authRoute);
Router.use('/user', userRoute);

module.exports = Router;