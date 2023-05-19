const jwt = require('jsonwebtoken')

const generateToken = (id_user, email) => {
    return jwt.sign({ id_user, email }, process.env.JWT_SECRET, {expiresIn: "4h"});
}

module.exports = {
    generateToken
}