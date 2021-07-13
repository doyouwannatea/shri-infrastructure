const { access } = require('fs/promises')

async function exists(path) {
    try {
        await access(path)
        return true
    } catch (error) {
        return false
    }
}

module.exports = {
    exists
}