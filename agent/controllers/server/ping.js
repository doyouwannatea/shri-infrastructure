/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
module.exports = (req, res) => {
    const { time } = req.body
    const ping = Date.now() - time
    res.send('ping: ' + ping)
}
