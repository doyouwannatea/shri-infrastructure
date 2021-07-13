const path = require('path')

module.exports = {
    ports: [3000, 3001],
    host: '127.0.0.1',
    serverHost: '127.0.0.1',
    serverPort: 8080,
    paths: {
        builds: path.resolve(__dirname, 'builds')
    }
}

