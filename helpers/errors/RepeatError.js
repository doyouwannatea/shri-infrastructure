const MyError = require('./MyError')

class RepeatError extends MyError {
    constructor(message) {
        super(message)
    }
}

module.exports = RepeatError