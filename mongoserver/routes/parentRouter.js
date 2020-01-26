const router = require('express').Router()
const ParentController = require('../controllers/parentController')
const gcsUpload = require('gcs-upload')
const authenticateParent = require('../middlewares/authenticateParent')

const upload = gcsUpload({
    limits: {
      fileSize: 1e6 // in bytes
    },
    gcsConfig: {
      keyFilename: process.env.GOOGLE_CLOUD_KEYFILE,  // this can also be set using GOOGLE_APPLICATION_CREDENTIALS environment variable 
      bucketName: process.env.CLOUD_BUCKET,
    }
  })

router.post('/signup', upload.single('avatar'), ParentController.register)
router.patch('/complete/:_id', authenticateParent, upload.single('avatar'), ParentController.update)
router.post('/signin', ParentController.login)
router.get('/', authenticateParent, ParentController.findAll)

module.exports = router