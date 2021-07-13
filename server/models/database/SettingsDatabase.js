const Database = require('./Database')

class SettingsDatabase extends Database {
    constructor(axiosInstance) {
        super(axiosInstance)
    }

    async getSettings() {
        const res = await this.axios.get('/conf')
        return res.data.data
    }
}

module.exports = SettingsDatabase