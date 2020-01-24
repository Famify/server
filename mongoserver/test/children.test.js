const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const Parent = require('../models/parent')
const Child = require('../models/child')
const { generateToken } = require('../helpers/jwt')
let currentAccessToken, familyId
let invalidToken = 'gawjhqgjwehwhbdnsad'

chai.use(chaiHttp)
const expect = chai.expect

after(function(done) {
    if (process.env.NODE_ENV === 'testing') {
        Parent.deleteMany()
            .then(_=> {
                console.log('testing: delete data parent succes!')
                return Child.deleteMany()
            })
            .then(_=> {
                console.log('testing: delete data child succes!')
                done()
            })
            .catch(console.log)
    }
})

before(function(done) {
    if (process.env.NODE_ENV === 'testing') {
        Parent.create({
            username: 'bapak',
            email: 'bapak@mail.com',
            password: '12345678',
            dateOfBirth: '1990-07-07'
        })
        .then(parent => {
        const payload = {
          _id: parent._id,
          username: parent.username,
          email: parent.email,
          role: parent.role,
          familyId: parent.familyId
        }
        currentAccessToken = generateToken(payload)
        familyId = parent.familyId
        done()
      })
      .catch(err => console.log(err))
    }
})


describe('Child Routes', function() {
    describe('POST /children/signup', function() {
        describe('success process', function() {
            it('should send an object (newChildren) with 201 status code', function(done) {
                chai.request(app)
                .post('/children/signup')
                .set({ access_token: currentAccessToken})
                .send({
                    username: 'anak1',
                    password: '12345678',
                    dateOfBirth: '2007-07-07'
                })
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(201)
                    expect(res.body).to.be.an('object').to.have.any.keys('rewardsHistory', 'role', '_id', 'username', 'dateOfBirth', 'password', 'familyId', 'createdAt', 'updatedAt', '__v')
                    expect(res.body.rewardsHistory).to.be.an('array')
                    expect(res.body.role).to.equal('child')
                    expect(res.body.username).to.equal('anak1')
                    expect(res.body.dateOfBirth).to.equal('2007-07-07T00:00:00.000Z')
                    expect(res.body.familyId).to.equal(familyId)
                    done()
                })
            }) 
        })
        describe('errors process', function() {
            it ('should send error with 401 status code because missing acces_token', function(done) {
                chai.request(app)
                .post('/children/signup')
                .send({
                    username: 'anak2',
                    password: '12345678',
                    dateOfBirth: '2007-07-07'
                })
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    expect(res.body.error).to.be.an('array').that.includes('Mohon log in terlebih dahulu.')
                    done()
                })
            })
            it ('should send error with 401 status code because invalid acces_token', function(done) {
                chai.request(app)
                .post('/children/signup')
                .set({ access_token: invalidToken})
                .send({
                    username: 'anak2',
                    password: '12345678',
                    dateOfBirth: '2007-07-07'
                })
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    expect(res.body.error).to.be.an('array').that.includes('Mohon log in terlebih dahulu.')
                    done()
                })
            })
            it ('should send error with 400 status code because missing username value', function(done) {
                chai.request(app)
                .post('/children/signup')
                .set({ access_token: currentAccessToken})
                .send({
                    username: '',
                    password: '12345678',
                    dateOfBirth: '2007-07-07'
                })
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body.error).to.be.an('array').that.includes('nama anak wajib diisi')
                    done()
                })
            })
            it ('should send error with 400 status code because username already exist', function(done) {
                chai.request(app)
                .post('/children/signup')
                .set({ access_token: currentAccessToken})
                .send({
                    username: 'anak1',
                    password: '12345678',
                    dateOfBirth: '2007-07-07'
                })
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body.error).to.be.an('array').that.includes('nama anak telah digunakan')
                    done()
                })
            })
            it ('should send error with 400 status code because missing password value', function(done) {
                chai.request(app)
                .post('/children/signup')
                .set({ access_token: currentAccessToken})
                .send({
                    username: 'anak2',
                    password: '',
                    dateOfBirth: '2007-07-07'
                })
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body.error).to.be.an('array').that.includes('kata sandi wajib diisi')
                    done()
                })
            })
            it ('should send error with 400 status code because password less than 8 characters', function(done) {
                chai.request(app)
                .post('/children/signup')
                .set({ access_token: currentAccessToken})
                .send({
                    username: 'anak2',
                    password: '123',
                    dateOfBirth: '2007-07-07'
                })
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body.error).to.be.an('array').that.includes('kata sandi minimal 8 karakter')
                    done()
                })
            })
            it ('should send error with 400 status code because missing date of birth value', function(done) {
                chai.request(app)
                .post('/parents/signup')
                .set({ access_token: currentAccessToken})
                .send({
                    username: 'anak2',
                    password: '12345678',
                    dateOfBirth: ''
                })
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body.error).to.be.an('array').that.includes('tanggal lahir wajib diisi')
                    done()
                })
            })
            it ('should send error with 400 status code because invalid date of birth value', function(done) {
                chai.request(app)
                .post('/parents/signup')
                .set({ access_token: currentAccessToken})
                .send({
                    username: 'anak2',
                    password: '12345678',
                    dateOfBirth: 'not date'
                })
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body.error).to.be.an('array').that.includes('Cast to Date failed for value "not date" at path "dateOfBirth"')
                    done()
                })
            })
        })
    })
    describe('POST /children/signin', function() {
        describe('success process', function() {
            it ('login with username should send an object (token, child) with 200 status code', function(done) {
                chai.request(app)
                .post('/children/signin')
                .send({
                    identity: 'anak1',
                    password: '12345678'
                })
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object').to.have.any.keys('token','child')
                    expect(res.body.child).to.be.an('object').to.have.any.keys('_id', 'username', 'dateOfBirth', 'familyId', 'role')
                    expect(res.body.child.username).to.equal('anak1')
                    expect(res.body.child.role).to.equal('child')
                    done()
                })
            })
        })
        describe('errors process', function() {
            it('should send error with status code 500 because missing identity value', function(done) {
                chai.request(app)
                .post('/children/signin')
                .send({
                    identity: '',
                    password: '12345678'
                })
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(500)
                    expect(res.body.error).to.be.an('array')
                    expect(res.body.error[0].message).to.equal('identitas wajib diisi')
                    done()
                })
            })
            it('should send error with status code 500 because missing password value', function(done) {
                chai.request(app)
                .post('/children/signin')
                .send({
                    identity: 'test',
                    password: ''
                })
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(500)
                    expect(res.body.error).to.be.an('array')
                    expect(res.body.error[0].message).to.equal('kata sandi wajib diisi')
                    done()
                })
            })
            it('should send error with status code 500 because invalid identity value', function(done) {
                chai.request(app)
                .post('/children/signin')
                .send({
                    identity: 'test3',
                    password: '12345678'
                })
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(500)
                    expect(res.body.error).to.be.an('array')
                    expect(res.body.error[0].message).to.equal('identitas atau kata sandi salah')
                    done()
                })
            })
            it('should send error with status code 500 because invalid password value', function(done) {
                chai.request(app)
                .post('/children/signin')
                .send({
                    identity: 'anak1',
                    password: '123456789'
                })
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(500)
                    expect(res.body.error).to.be.an('array')
                    expect(res.body.error[0].message).to.equal('identitas atau kata sandi salah')
                    done()
                })
            })
        })
    })
})