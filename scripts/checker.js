const fs = require('fs')
const path = require('path')
const { baseInputInq, multiProcessCommandExec } = require('./utils')
const { logUtils } = require('./constant')

const NEED_CHECK_PENDING_QUEUE = [checkCurrentFolderTreeLocation, checkConfigExist]
const pathUtil = p => path.resolve(__dirname, p)

async function Checker() {
    NEED_CHECK_PENDING_QUEUE.every(v => v()) || process.exit(1)
}

async function checkConfigExist() {
    const filePath = pathUtil('../release-config.js')
    const isExist = fs.existsSync(filePath)
    if (isExist) {
        logUtils.success('✅：配置文件校验通过\n')
        return true
    } else {
        return await generatorConfigFile(filePath, pathUtil('./template/release-config.js'))
    }
}

function checkCurrentFolderTreeLocation() {
    const dictList = multiProcessCommandExec('ls').split('\n')
    const ROOT_FOLDER_CHECK_WHITE_MEMBER = ['package.json']
    const isPackageExist = dictList.findIndex(v => v === ROOT_FOLDER_CHECK_WHITE_MEMBER[0])
    if (isPackageExist < 0) {
        logUtils.error('❌：您当前没有处于项目根目录，请切换至multi-repo或mono-repo的项目基建根目录！')
        return false
    }
    logUtils.success('✅：根目录校验通过\n')
    return true
}

async function generatorConfigFile(realExistPath, templateFilePath) {
    logUtils.warn('⌛️：根目录没有配置文件，prompt根据默认模版配置生成中...')
    const file = require(templateFilePath)
    const configList = flatConfigTreeFn(file, undefined)
    const promptLists = baseInputInq(Object.keys(configList).map(k => `请键入配置 ${k} `), Object.values(configList))
    const res = await promptLists
    const customConfigContent = {}

    const TRANSFORM_MAP = new Map([
        ['true', true],
        ['false', false]
    ])
    const transform = v => TRANSFORM_MAP.has(v) ? TRANSFORM_MAP.get(v) : v
    Object.keys(configList).forEach((k, i) => {
        const [prefix, suffix] = k.split('.')
        if (suffix === void 0) {
            customConfigContent[prefix] = transform(res[i])
        } else {
            customConfigContent[prefix] = customConfigContent[prefix] || {}
            customConfigContent[prefix][suffix] = transform(res[i])
        }
    })
    fs.writeFileSync(realExistPath, `module.exports = ${JSON.stringify(customConfigContent, null, '\t')};`)
    logUtils.success('✅：\n写入release发布配置成功！')
    return true
}

function flatConfigTreeFn(fileContent, prefix) {
    const flatConfigTree = {}
    Object.keys(fileContent).forEach(k => {
        const v = fileContent[k]
        if (typeof v === 'object') {
            const objs = flatConfigTreeFn(v, k)
            Object.entries(objs).forEach(([key, value]) => {
                flatConfigTree[key] = value
            })
        } else {
            const key = prefix ? prefix + '.' + k : k
            flatConfigTree[key] = v
        }
    })
    return flatConfigTree
}

Checker();
