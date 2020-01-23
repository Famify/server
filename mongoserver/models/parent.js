const { Schema, model, mongo } = require('mongoose')
const { hashPassword, checkPassword } = require('../helpers/bcrypt')

const parentSchema = new Schema({
    username: {
        type: String,
        required: [true, ''],
        validate: [
            {validator: isUsernameUnique, message: 'nama pengguna telah digunakan'}
        ]
    },
    email: {
        type: String,
        required: [true, 'email wajib diisi'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'format email invalid'],
        validate: [
            {validator: isEmailUnique, message: 'email telah teregistrasi'}
        ],
    },
    password: {
        type: String,
        required: [true, 'password wajib diisi'],
        minlength: [8, 'password minimal 8 karakter']
    },
    childrens: [{
        type: Schema.Types.ObjectId
    }],
    familyId: new mongo.ObjectId()
}, {
    timestamps: true
})

//validation
function isEmailUnique(value) {
    return Parent.findOne({ email: value })
      .then(found => {
        if (found) return false
        else return true
      })
  }

function isUsernameUnique(value) {
    return Parent.findOne({ name: value })
      .then(found => {
        if (found) return false
        else return true
      })
  }
  
//hashPassword
parentSchema.pre('save', function(next) {
    this.password = hashPassword(this.password)
    next()
})

const Parent = model('Parent', parentSchema)

module.exports = Parent
