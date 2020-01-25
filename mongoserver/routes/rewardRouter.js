const router = require('express').Router()
const RewardController = require('../controllers/rewardController')
const gcsUpload = require('gcs-upload')

const authenticateParent = require('../middlewares/authenticateParent')
const authenticateChild = require('../middlewares/authenticateChild')
const authenticateParentOrChild = require('../middlewares/authenticateParentOrChild')
const authorizeParent = require('../middlewares/authorizeParentReward')

const upload = gcsUpload({
  limits: {
    fileSize: 1e6 // in bytes
  },
  gcsConfig: {
    keyFilename: process.env.GOOGLE_CLOUD_KEYFILE,  // this can also be set using GOOGLE_APPLICATION_CREDENTIALS environment variable 
    bucketName: process.env.CLOUD_BUCKET,
  }
})

router.patch('/:id', authenticateChild, authorizeParent, RewardController.claimReward)

router.put('/:id', authenticateParent, authorizeParent, upload.single('image'), RewardController.update)
router.delete('/:id', authenticateParent, authorizeParent, RewardController.delete)

router.get('/:id', authenticateParentOrChild, RewardController.fetchOne)
router.get('/', authenticateParentOrChild, RewardController.fetchAll)

router.post('/', authenticateParent, upload.single('image'), RewardController.add)

module.exports = router