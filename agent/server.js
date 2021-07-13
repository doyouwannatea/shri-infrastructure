const express = require('express')

const { ports, host } = require('./agent-conf')
const ServerWorker = require('./models/ServerWorker')
const serverRouter = require('./routers/serverRouter')
const { repeatRequest } = require('../helpers/repeatRequest')

const serverWorker = new ServerWorker()

ports.forEach((port) => {
    const agent = express()
    agent.use(express.json())
    agent.use(serverRouter)

    const agentServer = require('http').createServer(agent)
    agentServer.listen(port, host, async () => {
        const host = agentServer.address().address
        console.log(`Agent started at http://${host}:${port}`)

        try {
            await repeatRequest(() => serverWorker.notifyOnCreate(host, port))
        } catch (error) {
            console.error(error)
        }

    })
})
