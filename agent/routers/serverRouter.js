const express = require('express')
const { build, ping } = require('../controllers/server')

const serverRouter = new express.Router()

serverRouter.post('/build', build)
serverRouter.get('/ping', ping)

module.exports = serverRouter