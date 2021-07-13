function concatLog({ stdout, stderr }) {
    return stdout + '\n' + stderr
}

module.exports = {
    concatLog
}