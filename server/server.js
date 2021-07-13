const express = require('express')
const app = express()
const { port, builds } = require('./server-conf.json')
const { checkBuilds } = require('./models/helpers/checkBuilds')

const agentRouter = require('./routers/agent')

app.use(express.json())
app.use('/', agentRouter)

app.listen(port, () => {
    console.log(`Server started at port ${port}`)
    checkBuilds(builds.timeout, builds.quantity)
})
