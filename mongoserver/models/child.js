const { Schema, model } = require('mongoose')
const { hashPassword, checkPassword } = require('../helpers/bcrypt')
const Parent = require('./parent')

const childSchema = new Schema({
    username: {
        type: String,
        required: [true, 'nama pengguna wajib diisi'],
        validate: [
            {validator: isUsernameUnique, message: 'nama pengguna telah digunakan'}
        ]
    },
    password: {
        type: String,
        required: [true, 'password wajib diisi'],
        minlength: [8, 'password minimal 8 karakter']
    },
    familyId: {
        type: String,
        required: [true, 'ID keluarga wajib diisi. Silakan tanyakan kepada orang tua'],
        validate: [
            {validator: isFamilyIdValid, message: 'ID keluarga tidak valid'}
        ]
    },
    avatar: String,
    role: {
        type: String,
        default: 'child'
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'tanggal lahir wajib diisi']
    },
    Point: {
        type: Number
    },
    RewardsHistory: [{
        type: Schema.Types.ObjectId
    }],
    avatar: {
        type: String
    }
}, {
    timestamps: true
})

function isUsernameUnique(value) {
    return Child.findOne({ name: value })
      .then(found => {
        if (found) return false
        else return true
      })
  }

function isFamilyIdValid(value) {
    return Parent.findOne({familyId: value})
        .then(found => {
            if (found) return true
            else return false
        })
}
  
//hashPassword
childSchema.pre('save', function(next) {
    this.password = hashPassword(this.password)
    next()
})

const Child = model('Child', childSchema)

module.exports = Child
