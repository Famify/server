const Child = require('../models/child')
const { verifyToken } = require('../helpers/jwt')

module.exports = (req, res, next) => {
  let decoded = verifyToken(req.headers.access_token)

  if (!decoded) throw {
    status: 401,
    message: 'Anda tidak memiliki akses.'
  }

  Child
    .findOne({ _id: decoded._id })
    .then(child => {
      if (!child) throw {
        status: 401,
        message: 'Anda tidak memiliki akses.'
      }

      req.loggedUser = {
        _id: child._id,
        username: child.username,
        email: child.email,
        role: child.role,
        familyId: child.familyId
      }
      next()
    })
    .catch(next)
}