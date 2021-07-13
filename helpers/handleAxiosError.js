function handleAxiosError(err) {
    if (err.response) {
        // client received an error response (5xx, 4xx)
        const { data, status, headers } = err.response

        console.error(err.response.data)
        console.error(err.response.status)
        console.error(err.response.headers)

        return { data, status, headers }
    } else if (err.request) {
        // client never received a response, or request never left
        console.error(err.request)
        return { request: err.request }
    } else {
        // anything else
        console.error('Error', err.message)
        return { message: err.message }
    }
}

module.exports = {
    handleAxiosError
}