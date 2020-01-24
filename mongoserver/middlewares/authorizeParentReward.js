const Reward = require('../models/reward')

module.exports = (req, res, next) => {
  Reward
    .findById(req.params.id)
    .then(reward => {
      if (!reward) throw {
        status: 404,
        message: 'Data tidak ditemukan.'
      }

      if (reward.familyId !== req.loggedUser.familyId) throw {
        status: 401,
        message: 'Anda tidak memiliki akses.'
      }
      next()
    })
    .catch(next)
}