const express = require('express')
const router = express.Router()
const parentRouter = require('../routes/parentRouter')
// const childrenRouter = require('../routes/childrenRouter')

router.get('/', function(req,res,next) {
    res.status(200).json({
        message: 'You are connected to famify server, refers to API documentation for further information'
    })
})

router.use('/parents', parentRouter)
// router.use('/children', childrenRouter)

module.exports = router