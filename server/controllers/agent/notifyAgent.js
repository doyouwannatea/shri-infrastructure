/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
module.exports = (req, res) => {
    const { host, port } = req.body

    try {
        if (!host) throw new Error('no host')
        if (!port) throw new Error('no port')

        res.json({
            message: 'Agent registered',
            host,
            port
        })
    } catch (error) {
        console.error(error)
    }
}

