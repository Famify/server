const Task = require('../models/task')

module.exports = (req, res, next) => {
  Task
    .findById(req.params.id)
    .then(task => {
      if (!task) throw {
        status: 404,
        message: 'Data tidak ditemukan.'
      }

      if (task.familyId !== req.loggedUser.familyId) throw {
        status: 401,
        message: 'Anda tidak memiliki akses.'
      }
      next()
    })
    .catch(next)
}