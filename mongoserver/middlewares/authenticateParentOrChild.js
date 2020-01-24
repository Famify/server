const Parent = require('../models/parent')
const Child = require('../models/child')
const { verifyToken } = require('../helpers/jwt')

module.exports = (req, res, next) => {
  let decoded = verifyToken(req.headers.access_token)

  if (!decoded) throw {
    status: 401,
    message: 'Anda tidak memiliki akses.'
  }

  let parent, child

  Parent
    .findOne({ _id: decoded._id })
    .then(parentData => {
      
      parent = parentData

      return Child
        .findOne({ _id: decoded._id })
    })
    .then(childData => {

      child = childData

      if (!parent && !child) throw {
        status: 401,
        message: 'Anda tidak memiliki akses.'
      }

      if (parent) {
        req.loggedUser = {
          _id: parent._id,
          username: parent.username,
          email: parent.email,
          role: parent.role,
          familyId: parent.familyId
        }
      }

      if (child) {
        req.loggedUser = {
          _id: child._id,
          username: child.username,
          role: child.role,
          familyId: child.familyId
        }
      }

      next()
    })
    .catch(next)
}