const Task = require('../models/task')

class TaskController {

  static add(req, res, next) {
    const { title, description, points, image, deadline } = req.body
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
    let options = { familyId: req.loggedUser.familyId }
    
    const { status } = req.query
    if (status) options.status = status

    Task
      .find(options)
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

  static claim(req, res, next) {
    Task
      .findOne(
        { _id: req.params.id, familyId: req.loggedUser.familyId },
      )
      .then(task => {
        if (task.status === 'claimed') throw {
          status: 403,
          message: 'Tugas telah diklaim.'
        }

        if (task.status === 'finished') throw {
          status: 403,
          message: 'Tugas telah diselesaikan.'
        }

        if (task.status === 'expired') throw {
          status: 403,
          message: 'Tugas sudah tidak berlaku.'
        }

        task.status = 'claimed'
        task.childId = req.loggedUser._id
        task.save()

        res.status(200).json({
          claimedTask: task, message: 'Berhasil mengambil tugas.'
        })
      })
      .catch(next)
  }

  static finish(req, res, next) {
    Task
      .findOne(
        { _id: req.params.id, familyId: req.loggedUser.familyId },
      )
      .then(task => {

        if (task.status === 'finished') throw {
          status: 403,
          message: 'Tugas telah diselesaikan.'
        }

        if (task.status === 'expired') throw {
          status: 403,
          message: 'Tugas sudah tidak berlaku.'
        }

        task.status = 'finished'
        task.save()

        res.status(200).json({
          finishedTask: task, message: 'Sukses mengubah status tugas menjadi selesai.'
        })
      })
      .catch(next)
  }

  static expire(req, res, next) {
    Task
      .findOne(
        { _id: req.params.id, familyId: req.loggedUser.familyId },
      )
      .then(task => {
        if (task.status === 'expired') throw {
          status: 403,
          message: 'Tugas sudah tidak berlaku.'
        }

        task.status = 'expired'
        task.save()

        res.status(200).json({
          finishedTask: task, message: 'Sukses mengubah status tugas menjadi `tidak berlaku`.'
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