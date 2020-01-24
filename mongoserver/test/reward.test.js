const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const { generateToken } = require('../helpers/jwt')

const Parent = require('../models/parent')

const expect = chai.expect
chai.use(chaiHttp)

let currentAccessToken = ''
let familyId = ''

describe.only('CRUD reward', () => {

  beforeEach((done) => {
    Parent
      .create({
        username: 'initial',
        email: 'initial@mail.com',
        password: 'initial123',
        role: 'parent'
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
  })

  afterEach(done => {
    Parent
      .deleteMany()
      .then(() => {
        console.log('Deleted all users.')
        done()
      })
      .catch(err => console.log(err))
  })

  // describe('GET /rewards', () => {

  // })

  // describe('GET /rewards/:id', () => {

  // })

  describe('POST /rewards', () => {
    it('should return a success message', done => {
      chai
        .request(app)
        .post('/rewards')
        .send({
          title: 'Reward',
          description: 'Reward my children can claim',
          points: 1000
        })
        .set('access_token', currentAccessToken)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(201)
          done()
        })
    })

  })

  // describe('PUT /rewards/:id', () => {

  // })

  // describe('PATCH /rewards/:id', () => {

  // })

  // describe('DELETE /rewards/:id', () => {

  // })
})