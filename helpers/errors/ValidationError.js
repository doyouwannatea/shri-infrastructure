const MyError = require('./MyError')

class ValidationError extends MyError {
    constructor(message) {
        super(message)
    }
}

module.exports = ValidationError