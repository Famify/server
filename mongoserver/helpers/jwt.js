const jwt = require('jsonwebtoken')

function generateToken(payload) {
    return jwt.sign(payload, process.env.PRIVATE_KEY)
}

function verifyToken(token) {
    return jwt.verify(token, process.env.PRIVATE_KEY)
}

module.exports = {generateToken, verifyToken}