const exec = require('exec-sh')
const { fileUtils, CLI_COMMON_CONFIG } = require('./utils')
const { logUtils } = require('./constant')

const repoConfig = CLI_COMMON_CONFIG().monorepo
async function changelog() {
    const tempFile = fileUtils({
        rootFile: './temp.json'
    })

    const repoName = tempFile?.repoName
    if (!!repoName) {
        logUtils.warn(`⌛️：此次版本更新为mono-repo： ${repoName}，即将输出CHANGELOG至该repo..\n`)
        await exec.promise(`cd ./${repoConfig.name}/${repoName} && conventional-changelog -p angular -i CHANGELOG.md -s`)
    } else {
        logUtils.warn(`⌛️：此次版本更新为根目录基建，即将更新根目录CHANGELOG..\n`)
        await exec.promise('conventional-changelog -p angular -i CHANGELOG.md -s')
    }
    logUtils.success('✅：CHANGELOG输出成功！\n')
}

changelog()