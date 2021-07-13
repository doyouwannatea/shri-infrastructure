const express = require('express')
const router = new express.Router()

const { notifyAgent, notifyBuildResult } = require('../controllers/agent')

router.post('/notify-agent', notifyAgent)
router.post('/notify-build-result', notifyBuildResult)

module.exports = router