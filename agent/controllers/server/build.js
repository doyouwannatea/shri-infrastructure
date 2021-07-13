const ServerWorker = require('../../models/ServerWorker')
const RepoWorker = require('../../models/RepoWorker')
const ValidationError = require('../../../helpers/errors/ValidationError')
const { paths } = require('../../agent-conf')
const { repeatRequest } = require('../../../helpers/repeatRequest')

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
module.exports = async (req, res) => {
    const { id, repoName, commitHash, buildCommand } = req.body
    const [host, port] = req.get('host').split(':')
    const serverWorker = new ServerWorker()
    const repoWorker = new RepoWorker()

    try {
        if (!id) throw new ValidationError('no id')
        if (!repoName) throw new ValidationError('no repo name')
        if (!commitHash) throw new ValidationError('no commit hash')
        if (!buildCommand) throw new ValidationError('no build command')

        res.json({ message: 'Succsess', status: 200 })

        const startBuildTime = Date.now()

        const { log, status } = await repoWorker.build(
            buildCommand,
            commitHash,
            repoWorker.getRepoLink(repoName),
            id,
            paths.builds
        )

        await repeatRequest(() =>
            serverWorker.notifyOnBuildResult(id, status, log, Date.now() - startBuildTime, host, port)
        )
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).json(error.pretty())
            return
        }

        if (!res.headersSent)
            res.status(400).json('server error')
    }
}
