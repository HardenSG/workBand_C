const chalk = require('chalk')

// 彩色日志
const logUtils = {
    error: msg => console.log(chalk.red.bold(msg)),
    warn: msg => console.log(chalk.yellow.bold(msg)),
    success: msg => console.log(chalk.green.bold(msg))
}

// 根据tag更新版本策略
const UPDATE_VERSION_TACTICS = {
    'patch': (major, middle, patch) => [major, middle, patch + 1],
    'beta': (major, middle) => [major, middle + 1, 0],
    'lasted': major => [major + 1, 0, 0],
}

module.exports = {
    logUtils,
    UPDATE_VERSION_TACTICS
}