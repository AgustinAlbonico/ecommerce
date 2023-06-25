const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Coupon = require('../models/couponModel');
const Order = require('../models/orderModel');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { validateMongodbID } = require('../utils/validateMongodbID');
const { generateRefreshToken } = require('../config/refreshToken');
const { validationResult } = require('express-validator');
const { sendEmail } = require('./emailController');
const crypto = require('crypto');
const uniqid = require('uniqid');

//Register
const registerUser = asyncHandler(async (req, res) => {
  //Valido que el usuario no exista
  let email = req.body.email;
  let findUser = await User.findOne({ email });

  if (findUser) {
    throw new Error('El usuario ya existe!');
  }

  //Creo el usuario
  let newUser = await User.create(req.body);
  ////SE PUEDE MEJORAR LOGIA DE TOKEN, CREAR UN ARCHIVO CREATETOKEN EN CONFIG Y MANDAR LA TOKEN COMO PARAMETRO(PARA NO REPETIR CODIGO)
  let emailToken = await newUser.createEmailVerificationToken();
  await newUser.save();

  //Envio mail con TOKEN de confirmacion de cuenta
  const resetUrl = `Hola <h2>${newUser.lastname}, ${newUser.firstname}!</h2> <br> Usa este link para confirmar tu cuenta:<a href='http://localhost:5000/api/auth/validate-email/${emailToken}'>Haz click aqui!</a>`;
  const data = {
    to: email,
    from: '"Link para confirmar tu cuenta!" <asd@example.com>',
    subject: 'Link para confirmar tu cuenta!',
    text: 'Hola!',
    html: resetUrl,
  };
  sendEmail(data);

  res.json(newUser);
});

//Validate email token
const validateEmailToken = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  try {
    const user = await User.findOne({
      emailValidationToken: hashedToken,
    });
    if (!user) return res.json('No se ha encontrado el usuario');
    user.isVerified = true;
    user.emailValidationToken = undefined;
    await user.save();
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

//Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //Valido los campos ingresados
  const resultValidation = validationResult(req);
  const hasErrors = !resultValidation.isEmpty();

  if (hasErrors) {
    return res.status(400).json(resultValidation.errors[0].msg);
  }

  //Verifico si existe el usuario
  const findUser = await User.findOne({ email });

  if (
    findUser &&
    (await findUser.isPasswordMatched(password)) &&
    findUser.isVerified
  ) {
    /*res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      phone: findUser?.phone,
      token: generateToken(findUser?._id),
    });*/

    //Trabajo con cookies directamente
    const refreshToken = await generateRefreshToken(
      findUser?._id,
      findUser?.email
    );
    const updateUser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken,
      },
      { new: true }
    );
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    const token = generateToken(findUser._id, findUser.email);
    res.cookie('access_token', token, { httpOnly: true }).json(updateUser);
  } else {
    if (!findUser.isVerified)
      throw new Error('Usuario con email no verificado', 404);
    throw new Error('Credenciales invalidas');
  }
});

//Login Admin
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //Valido los campos ingresados
  const resultValidation = validationResult(req);
  const hasErrors = !resultValidation.isEmpty();

  if (hasErrors) {
    return res.status(400).json(resultValidation.errors[0].msg);
  }

  //Verifico si existe el usuario
  const findAdmin = await User.findOne({ email });

  if (findAdmin.role !== 'admin') throw new Error('No autorizado');
  if (
    findAdmin &&
    (await findAdmin.isPasswordMatched(password)) &&
    findAdmin.isVerified
  ) {
    /*res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      phone: findUser?.phone,
      token: generateToken(findUser?._id),
    });*/

    //Trabajo con cookies directamente
    const refreshToken = await generateRefreshToken(
      findAdmin?._id,
      findAdmin?.email
    );
    const updateUser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken,
      },
      { new: true }
    );
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    const token = generateToken(findAdmin._id, findAdmin.email);
    res.cookie('access_token', token, { httpOnly: true }).json(updateUser);
  } else {
    if (!findAdmin.isVerified)
      throw new Error('Usuario con email no verificado', 404);
    throw new Error('Credenciales invalidas');
  }
});

//Handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refresh_token)
    throw new Error('No hay refresh token en las cookies');
  const refreshToken = cookie.refresh_token;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error('No hay refresh token en la bd');
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id_user) {
      throw new Error('Refresh token erronea');
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

//Get all users
const getUsers = asyncHandler(async (req, res) => {
  try {
    let users = await User.find();
    res.json(users);
  } catch (error) {
    throw new Error(error);
  }
});

//Get one user
const getOneUser = asyncHandler(async (req, res) => {
  try {
    let { id } = req.params;
    let user = await User.findById(id);
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

//Delete user
const deleteUser = asyncHandler(async (req, res) => {
  try {
    let { id } = req.params;
    validateMongodbID(id);
    let user = await User.findByIdAndDelete(id);
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

//Update an user
const updateUser = asyncHandler(async (req, res) => {
  let { _id } = req.user;
  validateMongodbID(_id);
  try {
    let updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req.body?.firstname,
        lastname: req.body?.lastname,
        email: req.body?.email,
        phone: req.body?.phone,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

//Logout
const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refresh_token)
    throw new Error('No existe refresh token guardado');
  const refreshToken = cookie.refresh_token;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await User.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: '',
    }
  );
  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204);
});

//Verifico si el user esta logueado
const isAuth = (req, res) => {
  const token = req.cookie.access_token;
  if (!token) {
    return res.json(false);
  }
};

//Bloqueo o desbloqueo un usuario
const blockOrUnblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbID(id);
  try {
    const user = await User.findOneAndUpdate(
      { _id: id },
      [{ $set: { isBlocked: { $eq: [false, '$isBlocked'] } } }],
      { new: true }
    );
    user.isBlocked
      ? res.json({ message: 'Usuario bloqueado' })
      : res.json({ message: 'Usuario desbloqueado' });
  } catch (error) {
    throw new Error(error);
  }
});

//Actualizo la contraseña
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongodbID(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

//Enviar mail de reset para password
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error('No se encontro ningun usuario con ese mail');

    const token = await user.createPasswordResetToken();
    await user.save();

    const resetUrl = `Usa este link para resetear tu contraseña. Este link tiene una duracion de 10 minutos. <a href='http://localhost:5000/api/auth/reset-password/${token}'>Haz click aqui!</a>`;
    const data = {
      to: email,
      from: '"Link para confirmar tu cuenta!" <asd@example.com>',
      subject: 'Link para reiniciar contraseña',
      text: 'Hola!',
      html: resetUrl,
    };
    sendEmailResetPassword(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

//Resetear password
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user)
    throw new Error(
      'El token expiro, por favor intentalo nuevamente mas tarde'
    );
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

//
const getWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id).populate('wishlist');
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

const saveAdress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbID(_id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      { new: true }
    );
    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});

const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  validateMongodbID(_id);
  try {
    let products = [];
    const user = await User.findById(_id);
    //Verifico si el usuario ya tiene productos en el carrito
    const existingCart = await Cart.findOne({ orderby: user._id });
    if (existingCart) {
      existingCart.remove();
    }
    //Creo un array con todos los productos para luego setearlo a un Cart
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select('price').exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    //Guardo el carrito relacionado al usuario
    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user?._id,
    }).save();

    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

//Devuelvo el carrito del user
const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbID(_id);
  try {
    const cart = await Cart.findOne({ orderby: _id }).populate(
      'products.product'
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

//Vacio el carrito
const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbID(_id);
  try {
    const cart = await Cart.findOneAndRemove({ orderby: _id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

//Aplico cupon
const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  validateMongodbID(_id);
  try {
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (!validCoupon) throw new Error('Cupon no valido!');
    const user = await User.findById(_id);
    let { cartTotal } = await Cart.findOne({
      orderby: user._id,
    }).populate('products.product');
    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);
    await Cart.findOneAndUpdate({ orderby: user._id }, { totalAfterDiscount });
    res.json(totalAfterDiscount);
  } catch (error) {
    throw new Error(error);
  }
});

//
const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  validateMongodbID(_id);
  if (!COD) throw new Error('Create cash order failed');
  try {
    const user = await User.findById(_id);
    let userCart = await Cart.findOne({ orderby: user._id });
    let totalAmount = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      totalAmount = userCart.totalAfterDiscount * 100;
    } else {
      totalAmount = userCart.cartTotal * 100;
    }
    //Creo la orden
    let newOrder = await Order.create({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: 'COD',
        amount: totalAmount,
        status: 'Cash on delivery',
        created: Date.now(),
        currency: 'usd',
      },
      orderby: user._id,
      orderStatus: 'Cash on delivery',
    });

    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    await Product.bulkWrite(update, {});
    res.json({ message: 'success' });
  } catch (error) {
    throw new Error(error);
  }
});

//Devolver orders de un cliente
const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbID(_id);
  try {
    let orders = await Order.find({ orderby: _id }).populate(
      'products.product'
    );
    res.json(orders);
  } catch (error) {
    throw new Error(error);
  }
});

//
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status,
        },
      },
      { new: true }
    );
    res.json(updateOrderStatus);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  registerUser,
  validateEmailToken,
  loginUser,
  loginAdmin,
  getUsers,
  getOneUser,
  deleteUser,
  updateUser,
  logoutUser,
  isAuth,
  blockOrUnblockUser,
  handleRefreshToken,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  saveAdress,
  getWishList,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
};
