const { Schema, model } = require('mongoose')

const rewardSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Mohon masukkan nama hadiah.']
  },
  description: {
    type: String
  },
  points: {
    type: Number,
    required: [true, 'Mohon masukkan poin yang perlu ditukarkan untuk mengklaim hadiah ini.']
  },
  status: {
    type: Boolean,
    default: true
  },
  familyId: {
    type: String,
    required: [true, 'familyID harus diisi.']
  },
  image: {
    type: String
  }
})

const Reward = model('Reward', rewardSchema)
module.exports = Reward