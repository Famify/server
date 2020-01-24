const router = require('express').Router()
const RewardController = require('../controllers/rewardController')
const gcsUpload = require('gcs-upload')
const authenticateParent = require('../middlewares/authenticateParent')

router.get('/:id', authenticateParent, RewardController.fetchOne)

router.use(authenticateParent)
router.post('/', RewardController.add)
router.get('/', RewardController.fetchAll)

module.exports = router