const RepeatError = require('./errors/RepeatError')
const { handleAxiosError } = require('./handleAxiosError')

/**
 * Повторяет переданную первым аргументом асинхронную функцию times раз c промежутком в timeout ms 
 * 
 * @param {() => Promise} cb 
 * @param {number} times 5 times
 * @param {number} timeout 3000 ms
 * @returns {Promise<undefined>}
 */
function repeatRequest(cb, times = 5, timeout = 3000) {
    return new Promise(async (resolve, reject) => {
        try {
            await cb()
            return resolve()
        } catch (error) {
            handleAxiosError(error)
        }
        const interval = setInterval(async () => {
            try {
                await cb()
                clearInterval(interval)
                return resolve()
            } catch (error) {
                handleAxiosError(error)

                times -= 1
                if (times < 0) {
                    clearInterval(interval)
                    return reject(new RepeatError('Время запроса истекло'))
                }
            }

        }, timeout)
    })
}

module.exports = {
    repeatRequest
}