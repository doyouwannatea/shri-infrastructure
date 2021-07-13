const { default: axios } = require('axios')
const { serverHost, serverPort } = require('../agent-conf')

class ServerWorker {

    constructor() {
        this.axios = axios.create({
            baseURL: `http://${serverHost}:${serverPort}`
        })
    }

    /**
     * @param {string} host 
     * @param {number} port 
     */
    async notifyOnCreate(host, port) {
        await this.axios.post('/notify-agent', { host, port })
    }

    /**
     * @param {number | string} id 
     * @param {number} status 
     * @param {string} log 
     * @param {number} duration 
     * @param {string} host
     * @param {number} port
     */
    async notifyOnBuildResult(id, status, log, duration, host, port) {
        await this.axios.post('/notify-build-result', { id, status, log, duration, host, port })
    }
}

module.exports = ServerWorker