const router = require('express').Router()
const RewardController = require('../controllers/rewardController')
const gcsUpload = require('gcs-upload')
const authenticateParent = require('../middlewares/authenticateParent')

router.use(authenticateParent)
router.post('/', RewardController.add)

module.exports = router