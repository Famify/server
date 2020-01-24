const router = require('express').Router()
const TaskController = require('../controllers/taskController')
const gcsUpload = require('gcs-upload')

const authenticateParent = require('../middlewares/authenticateParent')
const authenticateParentOrChild = require('../middlewares/authenticateParentOrChild')
const authorizeParent = require('../middlewares/authorizeParentTask')

router.put('/:id', authenticateParent, authorizeParent, TaskController.update)
router.delete('/:id', authenticateParent, authorizeParent, TaskController.delete)

router.get('/:id', authenticateParentOrChild, TaskController.fetchOne)
router.get('/', authenticateParentOrChild, TaskController.fetchAll)

router.post('/', authenticateParent, TaskController.add)

module.exports = router