const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const Parent = require('../models/parent')

chai.use(chaiHttp)
const expect = chai.expect

after(function(done) {
    if (process.env.NODE_ENV === 'testing') {
        Parent.deleteMany()
            .then(_=> {
                console.log('testing: delete data parent succes!')
            })
            .catch(console.log)
            .finally(_=> {
                done()
            })
    }
})

describe('Parent Routes', function() {
    describe('POST /parents/signup', function() {
        describe('success process', function() {
            it('should send an object (newParent) with 201 status code', function(done) {
                chai.request(app)
                .post('/parents/signup')
                .send({
                    username: 'test',
                    password: '12345678',
                    email: 'test@mail.com',
                    dateOfBirth: '1997-07-07'
                })
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(201)
                    expect(res.body).to.be.an('object').to.have.any.keys('childrens', 'role', '_id', 'username', 'dateOfBirth', 'password', 'email', 'familyId', 'createdAt', 'updatedAt', '__v')
                    expect(res.body.childrens).to.be.an('array')
                    expect(res.body.role).to.equal('parent')
                    expect(res.body.username).to.equal('test')
                    expect(res.body.dateOfBirth).to.equal('1997-07-07T00:00:00.000Z')
                    expect(res.body.email).to.equal('test@mail.com')
                    done()
                })
            }) 
        })
        describe('errors process', function() {
            it ('should send error with 400 status code because missing username value', function(done) {
                chai.request(app)
                .post('/parents/signup')
                .send({
                    username: '',
                    password: '12345678',
                    email: 'test2@mail.com',
                    dateOfBirth: '1997-07-07'
                })
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body.error).to.be.an('array').that.includes('nama pengguna wajib diisi')
                    done()
                })
            })
            it ('should send error with 400 status code because username already exist', function(done) {
                chai.request(app)
                .post('/parents/signup')
                .send({
                    username: 'test',
                    password: '12345678',
                    email: 'test2@mail.com',
                    dateOfBirth: '1997-07-07'
                })
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body.error).to.be.an('array').that.includes('nama pengguna telah digunakan')
                    done()
                })
            })
            it ('should send error with 400 status code because missing password value', function(done) {
                chai.request(app)
                .post('/parents/signup')
                .send({
                    username: 'test2',
                    password: '',
                    email: 'test2@mail.com',
                    dateOfBirth: '1997-07-07'
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
                .post('/parents/signup')
                .send({
                    username: 'test2',
                    password: '123',
                    email: 'test2@mail.com',
                    dateOfBirth: '1997-07-07'
                })
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body.error).to.be.an('array').that.includes('kata sandi minimal 8 karakter')
                    done()
                })
            })
            it ('should send error with 400 status code because missing email value', function(done) {
                chai.request(app)
                .post('/parents/signup')
                .send({
                    username: 'test2',
                    password: '123',
                    email: '',
                    dateOfBirth: '1997-07-07'
                })
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body.error).to.be.an('array').that.includes('email wajib diisi')
                    done()
                })
            })
            it ('should send error with 400 status code because email already exist', function(done) {
                chai.request(app)
                .post('/parents/signup')
                .send({
                    username: 'test2',
                    password: '123',
                    email: 'test@mail.com',
                    dateOfBirth: '1997-07-07'
                })
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body.error).to.be.an('array').that.includes('email telah teregistrasi')
                    done()
                })
            })
            it ('should send error with 400 status code because missing date of birth value', function(done) {
                chai.request(app)
                .post('/parents/signup')
                .send({
                    username: 'test2',
                    password: '12345678',
                    email: 'test2@mail.com',
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
                .send({
                    username: 'test2',
                    password: '12345678',
                    email: 'test2@mail.com',
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
    describe('POST /parents/signin', function() {
        describe('success process', function() {
            it ('should send an object (token, parent) with 200 status code', function(done) {
                chai.request(app)
                .post('/parents/signin')
                .send({
                    identity: 'test',
                    password: '12345678'
                })
                .end(function(err, res) {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object').to.have.any.keys('token','parent')
                    done()
                })
            })
        })
    })
})