const Task = require('../models/task')

class TaskController {

  static add(req, res, next) {
    const { title, description, points, image } = req.body
    Task
      .create({
        title, description, points, familyId: req.loggedUser.familyId, image, deadline
      })
      .then(newTask => {
        res.status(201).json(
          { newTask, message: 'Berhasil menambahkan tugas baru.' }
        )
      })
      .catch(next)
  }

  static fetchAll(req, res, next) {
    Task
      .find({ familyId: req.loggedUser._id })
      .then(allTasks => {
        res.status(200).json(allTasks)
      })
      .catch(next)
  }

  static fetchOne(req, res, next) {
    Task
      .findOne({ _id: req.params.id, familyId: req.loggedUser.familyId })
      .then(task => {

        if (!task) throw {
          status: 404,
          message: 'Data tidak ditemukan.'
        }

        res.status(200).json(task)
      })
      .catch(next)
  }

  static update(req, res, next) {
    const { title, description, points, status, image } = req.body

    Task
      .findOneAndUpdate(
        { _id: req.params.id, familyId: req.loggedUser.familyId },
        { title, description, points, status, image },
        { new: true, omitUndefined: true }
      )
      .then(updatedTask => {
        res.status(200).json({
          updatedTask, message: 'Berhasil memperbaharui tugas.'
        })
      })
      .catch(next)
  }

  static delete(req, res, next) {
    Task
      .findByIdAndDelete(req.params.id)
      .then(_ => res.status(200).json({ message: 'Tugas telah dihapus.' }))
      .catch(next)
  }
}

module.exports = TaskController