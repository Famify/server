const express = require('express')
const router = express.Router()

router.get('/', function(req,res,next) {
    res.status(200).json({
        message: 'You are connected to famify server, refers to API documentation for further information'
    })
})

module.exports = router