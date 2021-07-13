const Database = require('./Database')

class BuildDatabase extends Database {
    constructor(axiosInstance) {
        super(axiosInstance)
    }

    async getBuilds(limit) {
        const res = await this.axios.get(`/build/list?limit=${limit}`)
        return res.data.data
    }

    async startBuild(buildId, dateTime) {
        return await this.axios.post('/build/start', { buildId, dateTime })
    }

    async finishBuild(buildId, duration, success, buildLog) {
        return await this.axios.post('/build/finish', { buildId, duration, success, buildLog })
    }

    async cancelBuild(buildId) {
        return await this.axios.post('/build/cancel', { buildId })
    }
}

module.exports = BuildDatabase