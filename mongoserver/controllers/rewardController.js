const Reward = require('../models/reward')

class RewardController {

  static add(req, res, next) {
    const { title, description, points, image } = req.body
    Reward
      .create({
        title, description, points, familyId: req.loggedUser.familyId, image
      })
      .then(newReward => {
        res.status(201).json(
          { newReward, message: 'Berhasil menambahkan hadiah baru.' }
        )
      })
      .catch(next)
  }
}

module.exports = RewardController