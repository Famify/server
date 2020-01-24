const router = require('express').Router()
const RewardController = require('../controllers/rewardController')
const gcsUpload = require('gcs-upload')

const authenticateParent = require('../middlewares/authenticateParent')
const authenticateParentOrChild = require('../middlewares/authenticateParentOrChild')
const authorizeParent = require('../middlewares/authorizeParentReward')

router.put('/:id', authenticateParent, authorizeParent, RewardController.update)
router.delete('/:id', authenticateParent, authorizeParent, RewardController.delete)

router.get('/:id', authenticateParentOrChild, RewardController.fetchOne)
router.get('/', authenticateParentOrChild, RewardController.fetchAll)

router.post('/', authenticateParent, RewardController.add)

module.exports = router