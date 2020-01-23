const router = require('express').Router()
const RewardController = require('../controllers/rewardController')
const gcsUpload = require('gcs-upload')

router.post('/', RewardController.add)

module.exports = router