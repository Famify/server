const Parent = require('../models/parent')
const { verifyToken } = require('../helpers/jwt')

module.exports = (req, res, next) => {
  let decoded = verifyToken(req.headers.access_token)

  if (!decoded) throw {
    status: 401,
    message: 'Anda tidak memiliki akses.'
  }

  Parent
    .findOne({ _id: decoded._id })
    .then(parent => {
      if (!parent) throw {
        status: 401,
        message: 'Anda tidak memiliki akses.'
      }

      req.loggedUser = {
        _id: parent._id,
        username: parent.username,
        email: parent.email,
        role: parent.role,
        familyId: parent.familyId
      }
      next()
    })
    .catch(next)
}