const path = require('path')
const util = require('util')
const { rmdir, mkdir } = require('fs/promises')
const exec = util.promisify(require('child_process').exec)

const { concatLog } = require('../models/helpers/concatLog')
const { exists } = require('../models/helpers/exists')
const { recreateDir } = require('../models/helpers/recreateDir')

/**
 * @typedef ProcessOptions
 * @type {import('child_process').ExecOptions}
 */

/**
 * @typedef ProcessReturn
 * @type {import('child_process').PromiseWithChild<{
        stdout: string;
        stderr: string;
    }>}
 */

class RepoWorker {
    /**
     * @param {string} repoName 
     * @returns {string} link
     */
    getRepoLink(repoName) {
        return `https://github.com/${repoName}`
    }

    /**
     * @param {string} repoLink 
     * @param {ProcessOptions} config 
     * @returns {ProcessReturn} result
     */
    async cloneRepo(repoLink, config) {
        return exec(`git clone ${repoLink} .`, config)
    }

    /**
     * @param {string} commitHash 
     * @param {ProcessOptions} config 
     * @returns {ProcessReturn} result
     */
    async checkout(commitHash, config) {
        return exec(`git checkout ${commitHash}`, config)
    }

    /**
    * @param {ProcessOptions} config 
    * @returns {ProcessReturn} result
    */
    async installDeps(config) {
        return exec('npm i', config)
    }

    /**
     * @param {string} buildCommand 
     * @param {string} commitHash 
     * @param {string} repoLink 
     * @param {string | number} buildId 
     * @param {string} cwd 
     * @returns {Promise<{ log: string, status: number }>} result
     */
    async build(buildCommand, commitHash, repoLink, buildId, cwd) {
        let log, status
        const buildDir = path.resolve(cwd, buildId)
        const buildDirConfig = {
            shell: true,
            cwd: buildDir,
            env: {
                ...process.env,
                FORCE_COLOR: true,
                TERM: 'xterm-256color'
            }
        }

        try {
            if (!(await exists(cwd))) {
                await mkdir(cwd)
            }

            await recreateDir(buildDir)
            await this.cloneRepo(repoLink, buildDirConfig)
            await this.checkout(commitHash, buildDirConfig)
            await this.installDeps(buildDirConfig)

            const buildResult = await exec(buildCommand, buildDirConfig)
            log = concatLog(buildResult)
            status = 0
        } catch (error) {
            console.error(error)
            log = concatLog(error)
            status = error.code
        } finally {
            await rmdir(buildDir, { recursive: true })
        }

        return { log, status }
    }
}

module.exports = RepoWorker