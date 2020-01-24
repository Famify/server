const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const { generateToken } = require('../helpers/jwt')

const Parent = require('../models/parent')
const Child = require('../models/child')
const Reward = require('../models/reward')

const expect = chai.expect
chai.use(chaiHttp)

let currentAccessToken, familyId, rewardId, currentAccessToken2, familyId2, rewardId2, tokenChild1, tokenChild2

let wrongRewardId = '5e2a9096a8cbfc79123feed9'

describe('CRUD rewards', () => {

  beforeEach((done) => {
    Parent
      .create({
        username: 'initial',
        email: 'initial@mail.com',
        password: 'initial123',
        role: 'parent',
        dateOfBirth: new Date()
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

        return Child.create({
          username: 'anakSulung',
          familyId,
          dateOfBirth: new Date(),
          point: 5000,
          password: '12345678'
        })
      })
      .then(child => {
        const payload = {
          _id: child._id,
          username: child.username,
          email: child.email,
          role: child.role,
          familyId: child.familyId
        }

        tokenChild1 = generateToken(payload)

        return Child.create({
          username: 'anakBungsu',
          familyId,
          dateOfBirth: new Date(),
          point: 100,
          password: '12345678'
        })
      })
      .then(child => {
        const payload = {
          _id: child._id,
          username: child.username,
          email: child.email,
          role: child.role,
          familyId: child.familyId
        }

        tokenChild2 = generateToken(payload)

        return Parent
          .create({
            username: 'initial2',
            email: 'initial2@mail.com',
            password: 'initial2-123',
            role: 'parent',
            dateOfBirth: new Date()
          })
      })
      .then(parent => {
        const payload = {
          _id: parent._id,
          username: parent.username,
          email: parent.email,
          role: parent.role,
          familyId: parent.familyId
        }
        currentAccessToken2 = generateToken(payload)
        familyId2 = parent.familyId

        chai
          .request(app)
          .post('/rewards')
          .send({
            title: 'Initial reward',
            description: 'Initial reward my children can claim',
            points: 5000
          })
          .set('access_token', currentAccessToken)
          .end((err, res) => {
            rewardId = res.body.newReward._id

            chai
              .request(app)
              .post('/rewards')
              .send({
                title: 'Initial reward',
                description: 'Initial reward my children can claim',
                points: 5000
              })
              .set('access_token', currentAccessToken2)
              .end((err, res) => {
                rewardId2 = res.body.newReward._id
                done()
              })
          })
      })
      .catch(err => console.log(err))
  })

  afterEach(done => {
    Parent
      .deleteMany()
      .then(() => Reward.deleteMany())
      .then(() => Child.deleteMany())
      .then(() => done())
      .catch(err => console.log(err))
  })

  describe('GET /rewards', () => {
    it('should return all existing rewards that have user`s familyId', done => {
      chai
        .request(app)
        .get('/rewards')
        .set('access_token', currentAccessToken)
        .end((err, res) => {

          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')

          res.body.forEach(obj => {
            expect(obj.familyId === familyId)
          })

          done()
        })
    })
  })

  describe('GET /rewards/:id', () => {
    it('should return a reward with the same id as param', done => {
      chai
        .request(app)
        .get('/rewards/' + rewardId)
        .set('access_token', currentAccessToken)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)

          expect(res.body).to.be.an('object')
          expect(res.body._id).to.eql(rewardId)

          done()
        })
    })

    it('should return an error message when the rewardId is not found in the database', done => {
      chai
        .request(app)
        .get('/rewards/' + wrongRewardId)
        .set('access_token', currentAccessToken)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(404)

          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.undefined

          expect(res.body.error).to.be.an('array')
          expect(res.body.error[0]).to.eql('Data tidak ditemukan.')
          done()
        })
    })
  })

  describe('POST /rewards', () => {
    it('should return a success message when all required fields are filled', done => {
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

          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.a('string')
          expect(res.body.message).to.eql('Berhasil menambahkan hadiah baru.')

          done()
        })
    })

    it('should return an error when no title is inputted', done => {
      chai
        .request(app)
        .post('/rewards')
        .send({
          title: '',
          description: 'Reward my children can claim',
          points: 1000
        })
        .set('access_token', currentAccessToken)
        .end((err, res) => {

          expect(err).to.be.null
          expect(res).to.have.status(400)

          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.undefined

          expect(res.body.error).to.be.an('array')
          expect(res.body.error[0]).to.eql('Mohon masukkan nama hadiah.')

          done()
        })
    })

    it('should return an error when points field is empty', done => {
      chai
        .request(app)
        .post('/rewards')
        .send({
          title: 'Reward',
          description: 'Reward my children can claim',
          points: ''
        })
        .set('access_token', currentAccessToken)
        .end((err, res) => {

          expect(err).to.be.null
          expect(res).to.have.status(400)

          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.undefined

          expect(res.body.error).to.be.an('array')
          expect(res.body.error[0]).to.eql('Mohon masukkan poin yang perlu ditukarkan untuk mengklaim hadiah ini.')

          done()
        })
    })

    it('should return an error when user has not signed in', done => {
      chai
        .request(app)
        .post('/rewards')
        .send({
          title: 'Reward',
          description: 'Reward my children can claim',
          points: 1000
        })
        .end((err, res) => {

          expect(err).to.be.null
          expect(res).to.have.status(401)

          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.undefined

          expect(res.body.error).to.be.an('array')
          expect(res.body.error[0]).to.eql('Mohon sign in terlebih dahulu.')

          done()
        })
    })
  })

  describe('PUT /rewards/:id', () => {
    it('when successful should update a reward item', done => {

      const updateQuery = {
        title: 'Updated reward',
        description: 'New reward my children can claim',
        points: 6000
      }

      chai
        .request(app)
        .put('/rewards/' + rewardId)
        .send(updateQuery)
        .set('access_token', currentAccessToken)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)

          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.a('string')
          expect(res.body.message).to.eql('Berhasil memperbaharui hadiah.')

          expect(res.body.updatedReward).to.be.an('object')
          expect(res.body.updatedReward.title).to.eql(updateQuery.title)
          expect(res.body.updatedReward.description)
            .to.eql(updateQuery.description)
          expect(res.body.updatedReward.points).to.eql(updateQuery.points)

          done()
        })
    })

    it('should return an error message when a wrong rewardId is inputted', done => {
      const updateQuery = {
        title: 'Updated reward',
        description: 'New reward my children can claim',
        points: 6000
      }

      chai
        .request(app)
        .put('/rewards/' + wrongRewardId)
        .send(updateQuery)
        .set('access_token', currentAccessToken)
        .end((err, res) => {

          expect(err).to.be.null
          expect(res).to.have.status(404)

          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.undefined

          expect(res.body.updatedReward).to.be.undefined
          expect(res.body.error).to.be.an('array')
          expect(res.body.error[0]).to.eql('Data tidak ditemukan.')

          done()
        })
    })

    it('should return an error message when user is unauthorized to update', done => {
      const updateQuery = {
        title: 'Updated reward',
        description: 'New reward my children can claim',
        points: 6000
      }

      chai
        .request(app)
        .put('/rewards/' + rewardId)
        .send(updateQuery)
        .set('access_token', currentAccessToken2)
        .end((err, res) => {

          expect(err).to.be.null
          expect(res).to.have.status(401)

          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.undefined

          expect(res.body.updatedReward).to.be.undefined
          expect(res.body.error).to.be.an('array')
          expect(res.body.error[0]).to.eql('Anda tidak memiliki akses.')

          done()
        })
    })
  })

  describe('DELETE /rewards/:id', () => {
    it('when successful should delete a reward item', done => {
      chai
        .request(app)
        .delete('/rewards/' + rewardId)
        .set('access_token', currentAccessToken)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)

          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.a('string')
          expect(res.body.message).to.eql('Hadiah telah dihapus.')

          done()
        })
    })

    it('should return an error message when a wrong rewardId is inputted', done => {
      const updateQuery = {
        title: 'Updated reward',
        description: 'New reward my children can claim',
        points: 6000
      }

      chai
        .request(app)
        .delete('/rewards/' + wrongRewardId)
        .send(updateQuery)
        .set('access_token', currentAccessToken)
        .end((err, res) => {

          expect(err).to.be.null
          expect(res).to.have.status(404)

          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.undefined

          expect(res.body.error).to.be.an('array')
          expect(res.body.error[0]).to.eql('Data tidak ditemukan.')

          done()
        })
    })

    it('should return an error message when user is unauthorized to update', done => {
      const updateQuery = {
        title: 'Updated reward',
        description: 'New reward my children can claim',
        points: 6000
      }

      chai
        .request(app)
        .delete('/rewards/' + rewardId)
        .set('access_token', currentAccessToken2)
        .end((err, res) => {

          expect(err).to.be.null
          expect(res).to.have.status(401)

          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.undefined

          expect(res.body.updatedReward).to.be.undefined
          expect(res.body.error).to.be.an('array')
          expect(res.body.error[0]).to.eql('Anda tidak memiliki akses.')

          done()
        })
    })
  })

  describe('CLAIM /rewards/:id', () => {
    it('when successful should change reward status', done => {
      chai
        .request(app)
        .patch('/rewards/' + rewardId)
        .set('access_token', tokenChild1)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object').to.have.keys('status', '_id', 'title', 'description', 'points', 'familyId', '__v')
          expect(res.body.status).to.equal(false)
          done()
        })
    })
    it('should return an error message when a wrong rewardId is inputted', done => {
      chai
        .request(app)
        .patch('/rewards/' + wrongRewardId)
        .set('access_token', tokenChild1)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(404)
          expect(res.error.text).to.equal('{"error":["Data tidak ditemukan."]}')
          done()
        })
    })
    it('should return an error message when a wrong token is inputted', done => {
      chai
        .request(app)
        .patch('/rewards/' + wrongRewardId)
        .set('access_token', '12ytu1gewhehjwqjh')
        .end((err, res) => {
          expect(err).to.be.null
          console.log(res.error , 'ini error2')
          expect(res).to.have.status(401)
          expect(res.error.text).to.equal('{"error":["Mohon sign in terlebih dahulu."]}')
          done()
        })
    })
  })

})
