const express = require('express')
const app = express()
const { port } = require('../server-conf.json')

const agentRouter = require('./routes/agent')

app.use(agentRouter)

app.listen(port, () =>
    console.log(`Server started at port ${port}`)
)
