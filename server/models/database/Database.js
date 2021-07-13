const axios = require('axios')
const { apiBaseUrl, apiToken } = require('../../server-conf.json')

class Database {
    constructor(axiosInstance) {
        this.axios = axiosInstance || axios.create({
            baseURL: apiBaseUrl,
            headers: {
                'Authorization': `Bearer ${apiToken}`
            }
        })
    }
}

module.exports = Database