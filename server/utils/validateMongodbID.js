const mongoose = require('mongoose');

const validateMongodbID = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error('El ID ingresado no es un ID valido');
};

module.exports = { validateMongodbID };
