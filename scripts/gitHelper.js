const exec = require('exec-sh')
const { fileUtils, baseConfirmInq, multiProcessCommandExec, CLI_COMMON_CONFIG, baseListInq } = require('./utils')
const { logUtils } = require('./constant')

const git = CLI_COMMON_CONFIG().git
const gitHelper = async () => {
    let origins = multiProcessCommandExec('git remote')
    const canRelease = [isReleaseBranch(), !!origins].every(v => v)
    if (!canRelease) {
        logUtils.error('❌：请先确保checkout到目标release分支或拥有remote库！')
        return
    }
    origins = origins.split('\n')
    origins = origins.length > 1 ? await baseListInq('你有多个远程仓库，请选择', origins) : origins[0]

    const isNeedTag = await baseConfirmInq('是否需要tag？')
    const pkg = fileUtils()

    await exec.promise(`git config user.name "${git.name}"`);
    await exec.promise(`git config user.email "${git.email}"`);

    await exec.promise('git add .');
    await exec.promise(`git commit -m "chore(release): ${pkg.version} feature release"`)
    await exec.promise('git pull')
    await exec.promise(`git push --set-upstream ${origins} ${git.branch}`)
    if (isNeedTag) {
        logUtils.warn('⌛️：需要tag，推送远程标签中.....');
        await exec.promise(`git tag v${pkg.version}`);
        await exec.promise(`git push ${origins} --tags`);
        logUtils.success('✅：推送远程成功🏅');
    }
}

/**
 * 是否是release配置的分支
 */
function isReleaseBranch() {
    const currentBranch = multiProcessCommandExec('git branch --show-current');
    return git.branch === currentBranch
}

gitHelper()