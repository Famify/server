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
      .findOne({ _id: req.params.id, familyId: req.loggedUser.familyId })
      .then(reward => {

        if (!reward) throw {
          status: 404,
          message: 'Data tidak ditemukan.'
        }

        res.status(200).json(reward)
      })
      .catch(next)
  }

  static update(req, res, next) {
    const { title, description, points, status, image } = req.body

    Reward
      .findOneAndUpdate(
        { _id: req.params.id, familyId: req.loggedUser.familyId },
        { title, description, points, status, image },
        { new: true, omitUndefined: true }
      )
      .then(updatedReward => {
        res.status(200).json({
          updatedReward, message: 'Berhasil memperbaharui hadiah.'
        })
      })
      .catch(next)
  }

  static delete(req, res, next) {
    Reward
      .findByIdAndDelete(req.params.id)
      .then(_ => res.status(200).json({ message: 'Hadiah telah dihapus.' }))
      .catch(next)
  }
}

module.exports = RewardController