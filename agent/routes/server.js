const express = require('express')
const router = express.Router()

const { build } = require('../controllers/server')

router.post('/build ', build)

module.exports = router