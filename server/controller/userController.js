const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const validateMongodbID = require("../utils/validateMongodbID");
const { generateRefreshToken } = require("../config/refreshToken");

//Register
const createUser = asyncHandler(async (req, res) => {
  let email = req.body.email;
  let findUser = await User.findOne({ email });

  if (findUser) {
    throw new Error("El usuario ya existe!");
  }

  let newUser = await User.create(req.body);

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
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    const token = generateToken(findUser._id, findUser.email);
    res.cookie("access_token", token, { httpOnly: true }).json(findUser);
  } else {
    throw new Error("Credenciales invalidas");
  }
});

//Handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refresh_token)
    throw new Error("No hay refresh token en las cookies");
  const refreshToken = cookie.refresh_token;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No hay refresh token en la bd");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id_user) {
      throw new Error("Refresh token erronea");
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
    throw new Error("No existe refresh token guardado");
  const refreshToken = cookie.refresh_token;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await User.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: "",
    }
  );
  res.clearCookie("refresh_token", {
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
    const user = await User.findOneAndUpdate({ _id: id }, [
      { $set: { isBlocked: { $eq: [false, "$isBlocked"] } } },
    ]);
    !user.isBlocked
      ? res.json({ message: "Usuario bloqueado" })
      : res.json({ message: "Usuario desbloqueado" });
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
  logoutUser,
  isAuth,
  blockOrUnblockUser,
  handleRefreshToken,
};
