const { Schema, model, Types } = require('mongoose')

const taskSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Mohon masukkan judul tugas.']
  },
  description: {
    type: String
  },
  points: {
    type: Number,
    required: [true, 'Mohon masukkan poin yang akan didapatkan ketika menyelesaikan tugas ini.']
  },
  status: {
    type: String,
    enum: ['unclaimed', 'claimed', 'finished', 'expired'],
    default: 'unclaimed'
  },
  familyId: {
    type: String,
    required: [true, 'familyID harus diisi.']
  },
  childId: {
    type: Types.ObjectId,
    default: ''
  },
  image: {
    type: String
  },
  deadline: {
    type: Date
  }
})

const Task = model('Task', taskSchema)
module.exports = Task