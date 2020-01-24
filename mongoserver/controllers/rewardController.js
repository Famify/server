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

  static fetchAll(req, res, next) {
    Reward
      .find({ familyId: req.loggedUser._id })
      .then(allRewards => {
        res.status(200).json(allRewards)
      })
      .catch(next)
  }

  static fetchOne(req, res, next) {
    Reward
      .find({ _id: req.params.id, familyId: req.loggedUser.familyId })
      .then(reward => {
        res.status(200).json(reward[0])
      })
      .catch(next)
  }
}

module.exports = RewardController