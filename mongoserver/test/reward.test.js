// const chai = require('chai')
// const chaiHttp = require('chai-http')
// const app = require('../app')
// const { generateToken } = require('../helpers/jwt')

// const Parent = require('../models/parent')
// const Reward = require('../models/reward')

// const expect = chai.expect
// chai.use(chaiHttp)

// let currentAccessToken, familyId, rewardId

// describe('CRUD rewards', () => {

//   beforeEach((done) => {
//     Parent
//       .create({
//         username: 'initial',
//         email: 'initial@mail.com',
//         password: 'initial123',
//         role: 'parent',
//         dateOfBirth: new Date()
//       })
//       .then(parent => {
//         const payload = {
//           _id: parent._id,
//           username: parent.username,
//           email: parent.email,
//           role: parent.role,
//           familyId: parent.familyId
//         }
//         currentAccessToken = generateToken(payload)
//         familyId = parent.familyId

//         chai
//           .request(app)
//           .post('/rewards')
//           .send({
//             title: 'Initial reward',
//             description: 'Initial reward my children can claim',
//             points: 5000
//           })
//           .set('access_token', currentAccessToken)
//           .end((err, res) => {
//             rewardId = res.body.newReward._id
//             done()
//           })
//       })
//       .catch(err => console.log(err))
//   })

//   afterEach(done => {
//     Parent
//       .deleteMany()
//       .then(() => Reward.deleteMany())
//       .then(() => done())
//       .catch(err => console.log(err))
//   })

//   describe('GET /rewards', () => {
//     it('should return all existing rewards that have user`s familyId', done => {
//       chai
//         .request(app)
//         .get('/rewards')
//         .set('access_token', currentAccessToken)
//         .end((err, res) => {

//           expect(err).to.be.null
//           expect(res).to.have.status(200)
//           expect(res.body).to.be.an('array')

//           res.body.forEach(obj => {
//             expect(obj.familyId === familyId)
//           })

//           done()
//         })
//     })
//   })

//   describe('GET /rewards/:id', () => {
//     it('should return a reward with the same id as param', done => {
//       chai
//         .request(app)
//         .get('/rewards/' + rewardId)
//         .set('access_token', currentAccessToken)
//         .end((err, res) => {
//           expect(err).to.be.null
//           expect(res).to.have.status(200)

//           expect(res.body).to.be.an('object')
//           expect(res.body._id).to.eql(rewardId)

//           done()
//         })
//     })

//     it.only('should return an error message when the param is not found in the database', done => {
//       chai
//         .request(app)
//         .get('/rewards/' + 'wrong-id')
//         .set('access_token', currentAccessToken)
//         .end((err, res) => {
//           expect(err).to.be.null
//           expect(res).to.have.status(404)

//           expect(res.body).to.be.an('object')
//           expect(res.body.message).to.be.undefined

//           expect(res.body.error).to.be.an('array')
//           expect(res.body.error[0]).to.eql('Data tidak ditemukan.')
//           done()
//         })
//     })
//   })

//   describe('POST /rewards', () => {
//     it('should return a success message when all required fields are filled', done => {
//       chai
//         .request(app)
//         .post('/rewards')
//         .send({
//           title: 'Reward',
//           description: 'Reward my children can claim',
//           points: 1000
//         })
//         .set('access_token', currentAccessToken)
//         .end((err, res) => {

//           expect(err).to.be.null
//           expect(res).to.have.status(201)

//           expect(res.body).to.be.an('object')
//           expect(res.body.message).to.be.a('string')
//           expect(res.body.message).to.eql('Berhasil menambahkan hadiah baru.')

//           done()
//         })
//     })

//     it('should return an error when no title is inputted', done => {
//       chai
//         .request(app)
//         .post('/rewards')
//         .send({
//           title: '',
//           description: 'Reward my children can claim',
//           points: 1000
//         })
//         .set('access_token', currentAccessToken)
//         .end((err, res) => {

//           expect(err).to.be.null
//           expect(res).to.have.status(400)

//           expect(res.body).to.be.an('object')
//           expect(res.body.message).to.be.undefined

//           expect(res.body.error).to.be.an('array')
//           expect(res.body.error[0]).to.eql('Mohon masukkan nama hadiah.')

//           done()
//         })
//     })

//     it('should return an error when points field is empty', done => {
//       chai
//         .request(app)
//         .post('/rewards')
//         .send({
//           title: 'Reward',
//           description: 'Reward my children can claim',
//           points: ''
//         })
//         .set('access_token', currentAccessToken)
//         .end((err, res) => {

//           expect(err).to.be.null
//           expect(res).to.have.status(400)

//           expect(res.body).to.be.an('object')
//           expect(res.body.message).to.be.undefined

//           expect(res.body.error).to.be.an('array')
//           expect(res.body.error[0]).to.eql('Mohon masukkan poin yang perlu ditukarkan untuk mengklaim hadiah ini.')

//           done()
//         })
//     })

//     it('should return an error when user has not logged in', done => {
//       chai
//         .request(app)
//         .post('/rewards')
//         .send({
//           title: 'Reward',
//           description: 'Reward my children can claim',
//           points: 1000
//         })
//         .end((err, res) => {

//           expect(err).to.be.null
//           expect(res).to.have.status(401)

//           expect(res.body).to.be.an('object')
//           expect(res.body.message).to.be.undefined

//           expect(res.body.error).to.be.an('array')
//           expect(res.body.error[0]).to.eql('Mohon log in terlebih dahulu.')

//           done()
//         })
//     })
//   })

//   // describe('PUT /rewards/:id', () => {

//   // })

//   // describe('PATCH /rewards/:id', () => {

//   // })

//   // describe('DELETE /rewards/:id', () => {

//   // })
// })
