const Parent = require('../models/parent')
const { hashPassword, checkPassword } = require('../helpers/bcrypt')
const { generateToken, verifyToken } = require('../helpers/jwt')

class ParentController {

    static register(req, res, next) {
        const { username, password, email, avatar } = req.body
        Parent.create({ username, password, email, avatar}) 
                .then((newParent) => {
                    res.status(201).json(newParent)
                })
                .catch(next)
    }

    static login(req, res, next) {
        if (!req.body.identity) throw { message: 'identitas wajib diisi'}
        if (!req.body.password) throw { message: 'password wajib diisi'}
        
        Parent.findOne({
            $or: [{ username: req.body.identity}, {email: req.body.identity}]
        })
            .then((parent) => {
                console.log(parent)
                if (!parent) throw {message: 'identitas atau password salah'}
                let passwordInput = req.body.password
                let passwordDb = parent.password
                let isPassword = checkPassword(passwordInput, passwordDb)
                console.log(isPassword, 'is password')
                if (!isPassword) throw {message: 'identitas atau password salah'}
                let payload = {
                    _id: parent._id,
                    username: parent.username,
                    email: parent.email,
                    familyId: parent.familyId
                }
                let token = generateToken(payload)
                console.log(token, 'ini token')
                res.status(200).json({token, parent})
            })
            .catch(next)
    }

}

module.exports = ParentController