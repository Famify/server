const router = require('express').Router()
const TaskController = require('../controllers/taskController')
const gcsUpload = require('gcs-upload')

const authenticateParent = require('../middlewares/authenticateParent')
const authenticateChild = require('../middlewares/authenticateChild')
const authenticateParentOrChild = require('../middlewares/authenticateParentOrChild')
const authorizeParent = require('../middlewares/authorizeParentTask')

router.patch('/:id/claim', authenticateChild, TaskController.claim)
router.patch('/:id/finish', authenticateParent, TaskController.finish)

router.put('/:id', authenticateParent, authorizeParent, TaskController.update)
router.delete('/:id', authenticateParent, authorizeParent, TaskController.delete)

router.get('/:id', authenticateParentOrChild, TaskController.fetchOne)
router.get('/', authenticateParentOrChild, TaskController.fetchAll)

router.post('/', authenticateParent, TaskController.add)

module.exports = router