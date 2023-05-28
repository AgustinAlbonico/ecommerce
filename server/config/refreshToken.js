const jwt = require('jsonwebtoken');

const generateRefreshToken = (id_user, email) => {
  return jwt.sign({ id_user, email }, process.env.JWT_SECRET, {
    expiresIn: '3d',
  });
};

module.exports = {
  generateRefreshToken,
};
