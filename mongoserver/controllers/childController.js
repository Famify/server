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
        if (!req.body.password) throw { message: 'kata sandi wajib diisi'}
        
        Child.findOne({ username: req.body.identity})
            .then((child) => {
                if (!child) throw {message: 'identitas atau kata sandi salah'}
                let passwordInput = req.body.password
                let passwordDb = child.password
                let isPassword = checkPassword(passwordInput, passwordDb)
                if (!isPassword) throw {message: 'identitas atau kata sandi salah'}
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

    static findAll(req, res, next) {
        const familyId = req.loggedUser.familyId
        Child.find({ familyId })
            .then(children => {
                res.status(200).json(children)
            })
            .catch(next)
    }

    static edit(req, res, next) {
        const _id = req.params._id
        Child.findByIdAndUpdate(_id, {
            dateOfBirth: new Date(req.body.dateOfBirth),
            avatar: req.body.avatar
        }, {new: true})
        .then(child => {
            res.status(200).json(child)
        })
        .catch(next)
    }

    static delete(req, res, next) {
        const _id = req.params._id
        Child.findByIdAndDelete(_id)
        .then(result => {
            res.status(200).json(result)
        })
        .catch(next)
    }

}

module.exports = ChildController