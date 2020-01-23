const { Schema, model } = require('mongoose')

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
    enum: ['unclaimed', 'claimed', 'finished'],
    default: 'unclaimed',
    required: [true, 'Status tugas harus diisi.']
  },
  familyID: {
    type: String,
    required: [true, 'familyID harus diisi.']
  },
  image: {
    type: String
  }
})

const Task = model('Task', taskSchema)
module.exports = Task