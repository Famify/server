const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const { generateToken } = require('../helpers/jwt')

const Parent = require('../models/parent')
const Child = require('../models/child')
const Task = require('../models/task')

const expect = chai.expect
chai.use(chaiHttp)

let currentAccessToken, familyId, taskId, currentAccessToken2, familyId2, taskId2, currrentChildAccessToken, childFamilyId, childTaskId, childId

let wrongTaskId = '5e2a9096a8cbfc79123feed9'

describe('CRUD tasks', () => {

  beforeEach(done => {
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
          familyId: parent.familyId
        }
        currentAccessToken = generateToken(payload)
        familyId = parent.familyId

        return Parent
          .create({
            username: 'initial2',
            email: 'initial2@mail.com',
            password: 'initial2-123',
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

        return Child
          .create({
            username: 'initial-child',
            password: 'initial-child',
            familyId,
            dateOfBirth: new Date()
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

        currrentChildAccessToken = generateToken(payload)
        childFamilyId = child.familyId
        childId = child._id

        return chai
          .request(app)
          .post('/tasks')
          .send({
            title: 'Initial task',
            description: 'Initial task my children can work on to get points',
            points: 5000,
            deadline: '2020-02-20'
          })
          .set('access_token', currentAccessToken)
      })
      .then(res => {
        taskId = res.body.newTask._id

        return chai
          .request(app)
          .post('/tasks')
          .send({
            title: 'Second initial task',
            description: 'Second initial task my children can work on to get points',
            points: 7000,
            deadline: '2020-02-20'
          })
          .set('access_token', currentAccessToken2)
      })
      .then(res => {
        taskId2 = res.body.newTask._id
        done()
      })
      .catch(err => console.log(err))
  })

  afterEach(done => {
    Parent
      .deleteMany()
      .then(() => {
        Task.deleteMany()
        return Child.deleteMany()
      })
      .then(() => done())
      .catch(err => console.log(err))
  })

  describe('GET /tasks', () => {
    it('should return all existing tasks that have user`s familyId', done => {
      chai
        .request(app)
        .get('/tasks')
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

    it('should also be accessible by user with role child', done => {
      chai
        .request(app)
        .get('/tasks')
        .set('access_token', currrentChildAccessToken)
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

  describe('GET /tasks?status=`unclaimed`', () => {
    it('should return all tasks that have `unclaimed` status', done => {
      chai
        .request(app)
        .post('/tasks')
        .send({
          title: 'Another task',
          description: 'Initial task my children can work on to get points',
          points: 5000,
          deadline: '2020-02-20'
        })
        .set('access_token', currentAccessToken)
        .then(_ => {
          return chai
            .request(app)
            .patch('/tasks/' + taskId + '/claim')
            .set('access_token', currrentChildAccessToken)
        })
        .then(res => {
          expect (res.body.claimedTask.status).to.eql('claimed')

          return chai
            .request(app)
            .get('/tasks?status=unclaimed')
            .set('access_token', currrentChildAccessToken)
        })
        .then(res => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')

          res.body.forEach(obj => {
            expect(obj.familyId === familyId)
            expect(obj.status === 'unclaimed')
          })

          done()
        })
        .catch(err => console.log(err))
    })
  })

  describe('GET /tasks?status=`claimed`', () => {
    it('should return all tasks that have `claimed` status', done => {
      chai
        .request(app)
        .post('/tasks')
        .send({
          title: 'Another task',
          description: 'Initial task my children can work on to get points',
          points: 5000,
          deadline: '2020-02-20'
        })
        .set('access_token', currentAccessToken)
        .then(_ => {
          return chai
            .request(app)
            .patch('/tasks/' + taskId + '/claim')
            .set('access_token', currrentChildAccessToken)
        })
        .then(res => {
          expect (res.body.claimedTask.status).to.eql('claimed')

          return chai
            .request(app)
            .get('/tasks?status=unclaimed')
            .set('access_token', currrentChildAccessToken)
        })
        .then(res => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')

          res.body.forEach(obj => {
            expect(obj.familyId === familyId)
            expect(obj.status === 'claimed')
          })

          done()
        })
        .catch(err => console.log(err))
    })
  })

  describe('GET /tasks?status=`finished`', () => {
    it('should return all tasks that have `finished` status', done => {
      chai
        .request(app)
        .post('/tasks')
        .send({
          title: 'Another task',
          description: 'Initial task my children can work on to get points',
          points: 5000,
          deadline: '2020-02-20'
        })
        .set('access_token', currentAccessToken)
        .then(_ => {
          return chai
            .request(app)
            .patch('/tasks/' + taskId + '/finish')
            .set('access_token', currentAccessToken)
        })
        .then(res => {
          expect (res.body.finishedTask.status).to.eql('finished')

          return chai
            .request(app)
            .get('/tasks?status=finished')
            .set('access_token', currentAccessToken)
        })
        .then(res => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')

          res.body.forEach(obj => {
            expect(obj.familyId === familyId)
            expect(obj.status === 'finished')
          })

          done()
        })
        .catch(err => console.log(err))
    })
  })

  describe('GET /tasks/:id', () => {
    it('should return a task with the same id as param', done => {
      chai
        .request(app)
        .get('/tasks/' + taskId)
        .set('access_token', currentAccessToken)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)

          expect(res.body).to.be.an('object')
          expect(res.body._id).to.eql(taskId)

          done()
        })
    })

    it('should also be accessible by user with role child', done => {
      chai
        .request(app)
        .get('/tasks/' + taskId)
        .set('access_token', currrentChildAccessToken)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)

          expect(res.body).to.be.an('object')
          expect(res.body._id).to.eql(taskId)

          done()
        })
    })

    it('should return an error message when the taskId is not found in the database', done => {
      chai
        .request(app)
        .get('/tasks/' + wrongTaskId)
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

  describe('POST /tasks', () => {
    it('should return a success message when all required fields are filled', done => {
      chai
        .request(app)
        .post('/tasks')
        .send({
          title: 'Task',
          description: 'Task my children can work on',
          points: 1000,
          deadline: '2020-02-20',
          image: 'https://picsum.photos/200/300'
        })
        .set('access_token', currentAccessToken)
        .end((err, res) => {

          expect(err).to.be.null
          expect(res).to.have.status(201)

          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.a('string')
          expect(res.body.message).to.eql('Berhasil menambahkan tugas baru.')

          done()
        })
    })

    it('should return an error message when a child tries to add tasks', done => {
      chai
        .request(app)
        .post('/tasks')
        .send({
          title: 'Task',
          description: 'Task for me',
          points: 1000,
          deadline: '2020-02-20'
        })
        .set('access_token', currrentChildAccessToken)
        .end((err, res) => {

          expect(err).to.be.null
          expect(res).to.have.status(401)

          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.undefined

          expect(res.body.error).to.be.an('array')
          expect(res.body.error[0]).to.eql('Anda tidak memiliki akses.')

          done()
        })
    })

    it('should return an error when no title is inputted', done => {
      chai
        .request(app)
        .post('/tasks')
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
          expect(res.body.error[0]).to.eql('Mohon masukkan judul tugas.')

          done()
        })
    })

    it('should return an error when points field is empty', done => {
      chai
        .request(app)
        .post('/tasks')
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
          expect(res.body.error[0]).to.eql('Mohon masukkan poin yang akan didapatkan ketika menyelesaikan tugas ini.')

          done()
        })
    })

    it('should return an error when user has not signed in', done => {
      chai
        .request(app)
        .post('/tasks')
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

  describe('PUT /tasks/:id', () => {
    it('when successful should update a task item', done => {
      const updateQuery = {
        title: 'Updated task',
        description: 'New task my children can work on',
        points: 6000
      }

      chai
        .request(app)
        .put('/tasks/' + taskId)
        .send(updateQuery)
        .set('access_token', currentAccessToken)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)

          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.a('string')
          expect(res.body.message).to.eql('Berhasil memperbaharui tugas.')

          expect(res.body.updatedTask).to.be.an('object')
          expect(res.body.updatedTask.title).to.eql(updateQuery.title)
          expect(res.body.updatedTask.description)
            .to.eql(updateQuery.description)
          expect(res.body.updatedTask.points).to.eql(updateQuery.points)

          done()
        })
    })

    it('should return an error message when a child tries to update tasks', done => {
      const updateQuery = {
        title: 'Updated task',
        description: 'New task for me',
        points: 6000
      }

      chai
        .request(app)
        .put('/tasks/' + taskId)
        .send(updateQuery)
        .set('access_token', currrentChildAccessToken)
        .end((err, res) => {

          expect(err).to.be.null
          expect(res).to.have.status(401)

          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.undefined

          expect(res.body.error).to.be.an('array')
          expect(res.body.error[0]).to.eql('Anda tidak memiliki akses.')

          done()
        })
    })

    it('should return an error message when a wrong taskId is inputted', done => {
      const updateQuery = {
        title: 'Updated task',
        description: 'New task my children can claim',
        points: 6000
      }

      chai
        .request(app)
        .put('/tasks/' + wrongTaskId)
        .send(updateQuery)
        .set('access_token', currentAccessToken)
        .end((err, res) => {

          expect(err).to.be.null
          expect(res).to.have.status(404)

          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.undefined

          expect(res.body.updatedTask).to.be.undefined
          expect(res.body.error).to.be.an('array')
          expect(res.body.error[0]).to.eql('Data tidak ditemukan.')

          done()
        })
    })

    it('should return an error message when user is unauthorized to update', done => {
      const updateQuery = {
        title: 'Updated task',
        description: 'New task my children can claim',
        points: 6000
      }

      chai
        .request(app)
        .put('/tasks/' + taskId)
        .send(updateQuery)
        .set('access_token', currentAccessToken2)
        .end((err, res) => {

          expect(err).to.be.null
          expect(res).to.have.status(401)

          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.undefined

          expect(res.body.updatedTask).to.be.undefined
          expect(res.body.error).to.be.an('array')
          expect(res.body.error[0]).to.eql('Anda tidak memiliki akses.')

          done()
        })
    })
  })

  describe('PATCH /tasks/:id/claim', () => {
    it('should add childId to task when successful', done => {
      chai
        .request(app)
        .patch('/tasks/' + taskId + '/claim')
        .set('access_token', currrentChildAccessToken)
        .end((err, res) => {

          expect(err).to.be.null
          expect(res).to.have.status(200)

          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.a('string')
          expect(res.body.message).to.eql('Berhasil mengambil tugas.')

          expect(res.body.claimedTask).to.be.an('object')
          expect(res.body.claimedTask.status).to.eql('claimed')
          expect(res.body.claimedTask.childId).to.eql(String(childId))

          done()
        })
    })

    it('should return an error when task is already claimed', done => {
      chai
        .request(app)
        .patch('/tasks/' + taskId + '/claim')
        .set('access_token', currrentChildAccessToken)
        .then(_ =>
          chai
            .request(app)
            .patch('/tasks/' + taskId + '/claim')
            .set('access_token', currrentChildAccessToken)
        )
        .then(res => {
          expect(res).to.have.status(403)

          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.undefined

          expect(res.body.claimedTask).to.be.undefined
          expect(res.body.error).to.be.an('array')
          expect(res.body.error[0]).to.eql('Tugas telah diklaim.')

          done()
        })
        .catch(err => console.log(err))
    })

    it('should return an error when parent tries to claim', done => {
      chai
        .request(app)
        .patch('/tasks/' + taskId + '/claim')
        .set('access_token', currentAccessToken)
        .end((err, res) => {

          expect(err).to.be.null
          expect(res).to.have.status(401)

          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.undefined

          expect(res.body.claimedTask).to.be.undefined
          expect(res.body.error).to.be.an('array')
          expect(res.body.error[0]).to.eql('Anda tidak memiliki akses.')

          done()
        })
    })
  })

  describe('PATCH /tasks/:id/finish', () => {
    it('should return with success when having parental authorization', done => {
      chai
        .request(app)
        .patch('/tasks/' + taskId + '/finish')
        .set('access_token', currentAccessToken)
        .end((err, res) => {

          expect(err).to.be.null
          expect(res).to.have.status(200)

          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.a('string')
          expect(res.body.message).to.eql('Sukses mengubah status tugas menjadi selesai.')

          expect(res.body.finishedTask).to.be.an('object')
          expect(res.body.finishedTask.status).to.eql('finished')

          done()
        })
    })

    it('should return an error when task is already finished', done => {
      chai
        .request(app)
        .patch('/tasks/' + taskId + '/finish')
        .set('access_token', currentAccessToken)
        .then(_ =>
          chai
            .request(app)
            .patch('/tasks/' + taskId + '/finish')
            .set('access_token', currentAccessToken)
        )
        .then(res => {
          expect(res).to.have.status(403)

          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.undefined

          expect(res.body.claimedTask).to.be.undefined
          expect(res.body.error).to.be.an('array')
          expect(res.body.error[0]).to.eql('Tugas telah diselesaikan.')

          done()
        })
        .catch(err => console.log(err))
    })

    it('should return an error when a child tries to access it', done => {
      chai
        .request(app)
        .patch('/tasks/' + taskId + '/finish')
        .set('access_token', currrentChildAccessToken)
        .then(_ =>
          chai
            .request(app)
            .patch('/tasks/' + taskId + '/finish')
            .set('access_token', currrentChildAccessToken)
        )
        .then(res => {
          expect(res).to.have.status(401)

          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.undefined

          expect(res.body.finishedTask).to.be.undefined
          expect(res.body.error).to.be.an('array')
          expect(res.body.error[0]).to.eql('Anda tidak memiliki akses.')

          done()
        })
        .catch(err => console.log(err))
    })
  })

  describe('DELETE /tasks/:id', () => {
    it('when successful should delete a task item', done => {
      chai
        .request(app)
        .delete('/tasks/' + taskId)
        .set('access_token', currentAccessToken)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)

          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.a('string')
          expect(res.body.message).to.eql('Tugas telah dihapus.')

          done()
        })
    })

    it('should return an error message when a child tries to delete tasks', done => {
      chai
        .request(app)
        .delete('/tasks/' + taskId)
        .set('access_token', currrentChildAccessToken)
        .end((err, res) => {

          expect(err).to.be.null
          expect(res).to.have.status(401)

          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.undefined

          expect(res.body.error).to.be.an('array')
          expect(res.body.error[0]).to.eql('Anda tidak memiliki akses.')

          done()
        })
    })

    it('should return an error message when a wrong taskId is inputted', done => {
      chai
        .request(app)
        .delete('/tasks/' + wrongTaskId)
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

    it('should return an error message when user is unauthorized to delete', done => {
      chai
        .request(app)
        .delete('/tasks/' + taskId)
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
})