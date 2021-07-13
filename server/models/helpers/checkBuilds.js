const BuildDatabase = require('../database/BuildDatabase')
const SettingsDatabase = require('../database/SettingsDatabase')
const { instance: agentWorker } = require('../AgentWorker')
const { handleAxiosError } = require('../../../helpers/handleAxiosError')
const { default: axios } = require('axios')

/**
 * @param {number} timeout 
 * @param {number} buildsAtTime 
 */
function checkBuilds(timeout = 10000, buildsAtTime = 10) {
    const buildDatabase = new BuildDatabase(),
        settingsDatabase = new SettingsDatabase()

    setInterval(async () => {
        if (!agentWorker.isFreeAgents())
            return console.log('All agents are busy')

        try {
            const { repoName, buildCommand } = await settingsDatabase.getSettings()
            const builds = await buildDatabase.getBuilds(buildsAtTime)

            for (const build of builds) {
                if (!agentWorker.isFreeAgents())
                    return console.log('All agents are busy')

                if (build.status !== 'Waiting')
                    continue

                const agent = agentWorker.runAgent()
                const agentUrl = agentWorker.getAgentURL(agent)
                try {
                    if (!(await agentWorker.pingAgent(agent))) throw new Error(`Агент ${agentUrl} не отвечает`)
                    await buildDatabase.startBuild(build.id, new Date(Date.now()))
                } catch (error) {
                    handleAxiosError(error)
                    return
                }

                try {
                    await axios.post(agentUrl + '/build', {
                        id: build.id,
                        commitHash: build.commitHash,
                        repoName,
                        buildCommand
                    })
                } catch (error) {
                    handleAxiosError(error)
                    return
                }
            }
        } catch (error) {
            handleAxiosError(error)
        }
    }, timeout)
}

module.exports = {
    checkBuilds
}