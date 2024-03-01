const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process');
const { UPDATE_VERSION_TACTICS } = require('./constant')

// 获得详细版本
function getVersion(versionStr) {
    const [major, middle, patch] = versionStr.split('.').map(v => Number(v))
    return {
        major,
        middle,
        patch
    }
}

/**
 * 更新版本的计算策略
 * @param {String} versionStr 字符串版本
 * @param {String} tactics 更新版本阈值策略
 * @returns {String} 更新后版本值
 */
function countVersion(versionStr, tactics) {
    const { major, middle, patch } = getVersion(versionStr)
    return UPDATE_VERSION_TACTICS[tactics](major, middle, patch).join('.')
}

/**
 * 文件读写操作
 * @param {Object} {
 *     action = 'read', 
 *     rootFile = '../package.json',
 *     content
 * }
 * @return {String | Boolean} 
 */
function fileUtils({
    action = 'read',
    rootFile = '../package.json',
    content
} = {
        action: 'read',
        rootFile: '../package.json',
        content: ''
    }) {
    if (action === 'read') {
        return JSON.parse(fs.readFileSync(path.resolve(__dirname, rootFile)));
    } else {
        fs.writeFileSync(path.resolve(__dirname, rootFile), `${content}\n`);
        return true
    }
}

// inquirer 基础确认prompt
async function baseConfirmInq(prompt) {
    const options = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: prompt,
            choices: [
                {
                    name: 'YES',
                    value: true,
                },
                {
                    name: 'NO',
                    value: false,
                },
            ],
        },
    ]);
    return options.choice
}

/**
 * 基础列表prompt
 * @param {String} prompt 
 * @param {String[]} choiceList 
 * @returns 
 */
async function baseListInq(prompt = '选择列表中的某一项', choiceList) {
    const options = await inquirer.prompt([
        {
            type: 'list',
            name: 'listItem',
            message: prompt,
            choices: [...choiceList],
        },
    ]);
    return options.listItem
}

/**
 * 基础键入列表
 * @param {String[]} promptList - 问题列表
 * @param {String[]} defaultPromptList - 默认列表
 * @returns {any[]}
 */
async function baseInputInq(promptList = [], defaultPromptList = []) {
    function questionCreator(list) {
        return list.map((v, i) => ({
            type: 'input',
            name: `input-${i}`,
            message: v,
            default: defaultPromptList[i] || undefined
        }))
    }
    const optionObj = await inquirer.prompt([
        ...questionCreator(promptList)
    ]);
    return Object.keys(optionObj).map(k => optionObj[k])
}

/**
 * 利用子进程执行命令
 * @param {String} command 
 * @returns 
 */
function multiProcessCommandExec(command) {
    return execSync(command).toString().trim();
}

/**
 * 获取到根目录下的配置文件
 * @returns {{
 *  monorepo: {
 *      needMonorepo: Boolean
 *      name: String
 *  }
 *  git: {
 *      branch: String
 *      email: String
 *      name: String
 *  }
 * }}
 */
function getCLIConfig() {
    const p = path.resolve(__dirname, '../release-config.js')
    return fs.existsSync(p) && require(p)
}

// 获取cli基本配置
const CLI_COMMON_CONFIG = () => getCLIConfig()

module.exports = {
    countVersion,
    fileUtils,
    baseConfirmInq,
    baseListInq,
    baseInputInq,
    multiProcessCommandExec,
    CLI_COMMON_CONFIG
}