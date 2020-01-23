const { Schema, model } = require('mongoose')
const { hashPassword, checkPassword } = require('../helpers/bcrypt')

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, ''],
        validate: [
            {validator: isUsernameUnique, message: 'username already registered'}
        ]
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'invalid email format'],
        validate: [
            {validator: isEmailUnique, message: 'email already registered'}
        ],
    },
    password: {
        type: String,
        required: [true, 'password required'],
        minlength: [8, 'password min 8 char']
    },
    childrens: [{
        type: Schema.Types.ObjectId
    }],
    familyId: Schema.Types.ObjectId
}, {
    timestamps: true
})

//validation
function isEmailUnique(value) {
    return User.findOne({ email: value })
      .then(found => {
        if (found) return false
        else return true
      })
  }

function isNameUnique(value) {
    return User.findOne({ name: value })
      .then(found => {
        if (found) return false
        else return true
      })
  }
  
//hashPassword
userSchema.pre('save', function(next) {
    this.password = hashPassword(this.password)
    next()
})

const User = model('User', userSchema)

module.exports = User
