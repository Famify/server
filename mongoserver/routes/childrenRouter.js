const router = require('express').Router()
const ChildController = require('../controllers/childController')
const gcsUpload = require('gcs-upload')
const authenticateParent = require('../middlewares/authenticateParent')

const upload = gcsUpload({
    limits: {
      fileSize: 1e6 // in bytes
    },
    gcsConfig: {
      keyFilename: process.env.GOOGLE_CLOUD_KEYFILE,  // this can also be set using GOOGLE_APPLICATION_CREDENTIALS environment variable 
      bucketName: process.env.CLOUD_BUCKET,
      prefix: () => `${Date.now()}-` // optional, this is it's default value
    }
  })

router.post('/signup', authenticateParent, upload.single('avatar'), ChildController.register)
router.post('/signin', ChildController.login)
router.get('/', authenticateParent, ChildController.findAll)
router.patch('/:_id', authenticateParent, upload.single('avatar'), ChildController.edit)
router.delete('/:_id', authenticateParent, ChildController.delete)

module.exports = router