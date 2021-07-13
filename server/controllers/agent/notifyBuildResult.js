const BuildDatabase = require('../../models/database/BuildDatabase')
const { instance: agentWorker } = require('../../models/AgentWorker')
const { handleAxiosError } = require('../../../helpers/handleAxiosError')
const ValidationError = require('../../../helpers/errors/ValidationError')

const buildDatabase = new BuildDatabase()

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
module.exports = async (req, res) => {
    const { id, status, log, duration, host, port } = req.body
    agentWorker.freeAgent({ host, port })

    try {
        if (!id) throw new ValidationError('no id')
        if (!duration) throw new ValidationError('no duration')
        if (typeof status !== 'number') throw new ValidationError('no status')
        if (typeof log !== 'string') throw new ValidationError('no log')
    } catch (error) {
        console.error(error.pretty())
        return res.status(400).json(error.pretty())
    }

    try {
        await buildDatabase.finishBuild(id, duration, status === 0, log)
        return res.json({
            message: status === 0 ? 'Success' : 'Fail',
            time: duration
        })
    } catch (error) {
        const axiosError = handleAxiosError(error)
        res.status(400).json(axiosError)
    }

    try {
        await buildDatabase.cancelBuild(id)
    } catch (error) {
        handleAxiosError(error)
    }
}