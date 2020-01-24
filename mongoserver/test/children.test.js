const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const Parent = require('../models/parent')
const Child = require('../models/child')
const { generateToken } = require('../helpers/jwt')
let currentAccessToken, familyId, _id
let invalidToken = 'gawjhqgjwehwhbdnsad'
let invalidId = 'sagjh18721873673'

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
                    _id = res.body._id
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
    describe('GET /children/', function() {
        describe('success process', function() {
            it ('should return an array of object with status code 200', function(done) {
                chai.request(app)
                .get('/children')
                .set({ access_token: currentAccessToken})
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body[0]).to.be.an('object').to.have.any.keys('role', 'rewardsHistory', '_id', 'username', 'dateOfBirth', 'password', 'familyId', 'createdAt', 'updatedAt', '__v')
                    done()
                })
            })
        })
        describe('error process', function() {
            it ('should return 401 status code because invalid token', function(done) {
                chai.request(app)
                .get('/children')
                .set({ access_token: invalidToken })
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    expect(res.body.error).to.be.an('array')
                    expect(res.body.error[0]).to.equal('Mohon log in terlebih dahulu.')
                    done()
                })
            })
            it ('should return 401 status code because missing token value', function(done) {
                chai.request(app)
                .get('/children')
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    expect(res.body.error).to.be.an('array')
                    expect(res.body.error[0]).to.equal('Mohon log in terlebih dahulu.')
                    done()
                })
            })
        })
    })
    describe('PATCH /children/:_id', function() {
        describe('success process', function() {
            it ('should return an object with status code 200', function(done) {
                chai.request(app)
                .patch(`/children/${_id}`)
                .set({ access_token: currentAccessToken })
                .send({
                    dateOfBirth: '2007-09-09'
                })
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object').to.have.any.keys('role','rewardsHistory','_id','username','dateOfBirth','password','familyId','createdAt','updatedAt','__v')
                    expect(res.body.dateOfBirth).to.equal('2007-09-09T00:00:00.000Z')
                    done()
                })
            })
        })
        describe('error process', function() {
            it ('should return an error response with status code 401 because missing token value', function(done) {
                chai.request(app)
                .patch(`/children/${_id}`)
                .send({
                    dateOfBirth: '2007-09-09'
                })
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    expect(res.body.error).to.be.an('array')
                    expect(res.body.error[0]).to.equal('Mohon log in terlebih dahulu.')
                    done()
                })
            })
            it ('should return an error response with status code 401 because invalid token value', function(done) {
                chai.request(app)
                .patch(`/children/${_id}`)
                .set({ access_token: invalidToken })
                .send({
                    dateOfBirth: '2007-09-09'
                })
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    expect(res.body.error).to.be.an('array')
                    expect(res.body.error[0]).to.equal('Mohon log in terlebih dahulu.')
                    done()
                })
            })
            it ('should return an error response with status code 400 because invalid Id', function(done) {
                chai.request(app)
                .patch(`/children/${invalidId}`)
                .set({ access_token: currentAccessToken})
                .send({
                    dateOfBirth: '2007-09-09'
                })
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(404)
                    expect(res.body.error).to.be.an('array')
                    expect(res.body.error[0]).to.equal('Data tidak ditemukan.')
                    done()
                })
            })
            it ('should return an error response with status code 400 because missing parameter id', function(done) {
                chai.request(app)
                .patch(`/children/`)
                .set({ access_token: currentAccessToken})
                .send({
                    dateOfBirth: '2007-09-09'
                })
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(404)
                    done()
                })
            })
            it ('should return an error response with status code 400 because invalid date type', function(done) {
                chai.request(app)
                .patch(`/children/${_id}`)
                .set({ access_token: currentAccessToken})
                .send({
                    dateOfBirth: 'not date'
                })
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(404)
                    done()
                })
            })
        })
    })

    describe('DELETE /children/:_id', function() {
        describe('success process', function() {
            it ('should return an object with status code 200', function(done) {
                chai.request(app)
                .delete(`/children/${_id}`)
                .set({ access_token: currentAccessToken })
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    done()
                })
            })
        })
        describe('error process', function() {
            it ('should return an error response with status code 401 because missing token value', function(done) {
                chai.request(app)
                .delete(`/children/${_id}`)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    expect(res.body.error).to.be.an('array')
                    expect(res.body.error[0]).to.equal('Mohon log in terlebih dahulu.')
                    done()
                })
            })
            it ('should return an error response with status code 401 because invalid token value', function(done) {
                chai.request(app)
                .delete(`/children/${_id}`)
                .set({ access_token: invalidToken })
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    expect(res.body.error).to.be.an('array')
                    expect(res.body.error[0]).to.equal('Mohon log in terlebih dahulu.')
                    done()
                })
            })
            it ('should return an error response with status code 400 because invalid Id', function(done) {
                chai.request(app)
                .delete(`/children/${invalidId}`)
                .set({ access_token: currentAccessToken})
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(404)
                    expect(res.body.error).to.be.an('array')
                    expect(res.body.error[0]).to.equal('Data tidak ditemukan.')
                    done()
                })
            })
            it ('should return an error response with status code 400 because missing parameter id', function(done) {
                chai.request(app)
                .patch(`/children/`)
                .set({ access_token: currentAccessToken})
                .send({
                    dateOfBirth: '2007-09-09'
                })
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(404)
                    done()
                })
            })
        })
    })

})