const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

//Register
const createUser = asyncHandler(async (req, res) => {
  let email = req.body.email;
  let findUser = await User.findOne({ email });

  if (findUser) {
    throw new Error("El usuario ya existe!");
  }

  let newUser = await User.create(req.body);

  console.log(newUser);

  res.json(newUser);
});

//Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //Verifico si existe el usuario
  const findUser = await User.findOne({ email });

  if (findUser && (await findUser.isPasswordMatched(password))) {
    /*res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      phone: findUser?.phone,
      token: generateToken(findUser?._id),
    });*/
    //Trabajo con cookies directamente
    const token = generateToken(findUser._id, findUser.email);
    res.cookie("access_token", token, { httpOnly: true }).json(findUser);
  } else {
    throw new Error("Credenciales invalidas");
  }
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
    let user = await User.findByIdAndDelete(id);
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

//Update an user
const updateUser = asyncHandler(async (req, res) => {
  let { id } = req.params;
  try {
    let updatedUser = await User.findByIdAndUpdate(
      id,
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

module.exports = {
  createUser,
  loginUser,
  getUsers,
  getOneUser,
  deleteUser,
  updateUser,
};
