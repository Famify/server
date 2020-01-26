const router = require('express').Router()
const TaskController = require('../controllers/taskController')
const gcsUpload = require('gcs-upload')

const authenticateParent = require('../middlewares/authenticateParent')
const authenticateChild = require('../middlewares/authenticateChild')
const authenticateParentOrChild = require('../middlewares/authenticateParentOrChild')
const authorizeParent = require('../middlewares/authorizeParentTask')

const upload = gcsUpload({
  limits: {
    fileSize: 1e6 // in bytes
  },
  gcsConfig: {
    keyFilename: process.env.GOOGLE_CLOUD_KEYFILE,  // this can also be set using GOOGLE_APPLICATION_CREDENTIALS environment variable 
    bucketName: process.env.CLOUD_BUCKET,
  }
})

router.patch('/:id/claim', authenticateChild, TaskController.claim)
router.patch('/:id/finish', authenticateChild, upload.single('image'),TaskController.finish)
router.patch('/:id/expire', authenticateParent, TaskController.expire)

router.put('/:id', authenticateParent, authorizeParent, upload.single('image'),TaskController.update)
router.delete('/:id', authenticateParent, authorizeParent, TaskController.delete)

router.get('/:id', authenticateParentOrChild, TaskController.fetchOne)
router.get('/', authenticateParentOrChild, TaskController.fetchAll)

router.post('/', authenticateParent, upload.single('image'), TaskController.add)

module.exports = router