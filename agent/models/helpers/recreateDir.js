const { rmdir, mkdir } = require('fs/promises')

async function recreateDir(path) {
    try {
        await rmdir(path, { recursive: true })
        await mkdir(path)
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    recreateDir
}