const { instance: agentWorker } = require('../../models/AgentWorker')
const ValidationError = require('../../../helpers/errors/ValidationError')

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
module.exports = (req, res) => {
    const { host, port } = req.body
    try {
        if (!host) throw new ValidationError('no host')
        if (!port) throw new ValidationError('no port')

        agentWorker.addAgent({ host, port })

        const message = 'Agent registered'
        console.log(message + `: ${host}:${port}`)
        res.json({ message, host, port })
    } catch (error) {
        console.error(error)

        if (error instanceof ValidationError) {
            res.status(400).json(error.pretty())
            return
        }

        res.status(400).json('server error')
    }
}

