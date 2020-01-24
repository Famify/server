const Child = require('../models/child')
const { hashPassword, checkPassword } = require('../helpers/bcrypt')
const { generateToken, verifyToken } = require('../helpers/jwt')

class ChildController {

    static register(req, res, next) {
        const { username, password, avatar } = req.body
        const familyId = req.loggedUser.familyId
        const dateOfBirth = new Date(req.body.dateOfBirth)
        Child.create({ username, dateOfBirth, password, familyId, avatar}) 
                .then((newChild) => {
                    res.status(201).json(newChild)
                })
                .catch(next)
    }

    static login(req, res, next) {
        if (!req.body.identity) throw { message: 'identitas wajib diisi'}
        if (!req.body.password) throw { message: 'password wajib diisi'}
        
        Child.findOne({ username: req.body.identity})
            .then((child) => {
                if (!child) throw {message: 'identitas atau password salah'}
                let passwordInput = req.body.password
                let passwordDb = child.password
                let isPassword = checkPassword(passwordInput, passwordDb)
                if (!isPassword) throw {message: 'identitas atau password salah'}
                let payload = {
                    _id: child._id,
                    username: child.username,
                    email: child.email,
                    familyId: child.familyId
                }
                let token = generateToken(payload)
                res.status(200).json({token, child})
            })
            .catch(next)
    }

}

module.exports = ChildController