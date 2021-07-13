
const { default: axios } = require('axios')
const { builds: { timeout } } = require('../server-conf.json')

/**
 * @typedef Agent
 * @type {{ host: string, port: number }}
 */

class AgentWorker {
    constructor() {
        /**
         * @type {Agent[]}
         */
        this.freeAgents = []
        /**
         * @type {Agent[]}
         */
        this.busyAgents = []
        /**
         * @type {Agent[]}
         */
        this.deadAgents = []

        setInterval(async () => {
            await this.pingBusyAgents()
            await this.pingDeadAgents()
        }, timeout)
    }

    /**@param {Agent} agent */
    addAgent(agent) {
        agent = this.validate(agent)
        const isInFreeAgents = this.freeAgents.find(freeAgent =>
            freeAgent.host === agent.host && freeAgent.port === agent.port
        )
        const isInDeadAgents = this.deadAgents.find(deadAgent =>
            deadAgent.host === agent.host && deadAgent.port === agent.port
        )
        const isInBusyAgents = this.busyAgents.find(busyAgent =>
            busyAgent.host === agent.host && busyAgent.port === agent.port
        )
        if (!isInFreeAgents && !isInDeadAgents && !isInBusyAgents)
            this.freeAgents.push(agent)

        console.log(this.freeAgents)
    }

    /**@returns {Agent} agent */
    runAgent() {
        const agent = this.freeAgents.shift()
        this.busyAgents.push(agent)
        return agent
    }

    /**@param {Agent} agent */
    freeAgent(agent) {
        agent = this.validate(agent)

        this.busyAgents = this.busyAgents.filter(busyAgent =>
            agent.port !== busyAgent.port &&
            agent.host !== busyAgent.host
        )

        this.freeAgents.push(agent)
    }

    isFreeAgents() {
        return Boolean(this.freeAgents.length)
    }

    /**@param {Agent} agent */
    getAgentURL(agent) {
        return `http://${agent.host}:${agent.port}`
    }

    /**
     * @param {Agent} agent 
     * @returns {Agent} validated agent
    */
    validate(agent) {
        return { host: String(agent.host), port: Number(agent.port) }
    }

    async pingBusyAgents() {
        this.busyAgents.forEach(async (agent) => {
            const isAlive = await this.pingAgent(agent)

            if (!isAlive) {
                this.deadAgents.push(agent)
            }
        })

        this.deadAgents.forEach(agent => {
            this.busyAgents = this.busyAgents.filter(busyAgent =>
                agent.port !== busyAgent.port &&
                agent.host !== busyAgent.host
            )
        })
    }

    async pingDeadAgents() {
        this.deadAgents.forEach(async (agent) => {
            const isAlive = await this.pingAgent(agent)

            if (isAlive) {
                this.freeAgents.push(agent)
            }
        })

        this.freeAgents.forEach(agent => {
            this.deadAgents = this.deadAgents.filter(deadAgent =>
                agent.port !== deadAgent.port &&
                agent.host !== deadAgent.host
            )
        })
    }

    async pingAgent(agent) {
        const agentUrl = this.getAgentURL(agent)
        try {
            await axios.get(agentUrl + '/ping', { time: Date.now() })
            return true
        } catch (error) {
            return false
        }
    }
}

module.exports = {
    class: AgentWorker,
    instance: new AgentWorker()
}