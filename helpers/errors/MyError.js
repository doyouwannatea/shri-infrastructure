class MyError extends Error {
    constructor(message) {
        super(message)
    }

    pretty() {
        return {
            name: this.name,
            message: this.message
        }
    }
}

module.exports = MyError