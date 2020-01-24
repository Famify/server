const Reward = require('../models/reward')

class RewardController {

  static add(req, res, next) {
    const { title, description, points, familyID, image } = req.body
    Reward
      .create({ title, description, points, familyID, image })
      .then(newReward => {
        res.status(201).json(newReward)
      })
      .catch(next)
  }
}

module.exports = RewardController