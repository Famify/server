const router = require('express').Router()
const RewardController = require('../controllers/rewardController')

router.post('/', RewardController.add)

module.exports = router