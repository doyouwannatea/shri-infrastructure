const express = require('express')
const app = express()
const { port } = require('../agent-conf.json')

const serverRouter = require('./routes/server')

app.use(serverRouter)

app.listen(port, () =>
    console.log(`Agent started at port ${port}`)
)
