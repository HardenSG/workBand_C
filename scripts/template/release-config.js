module.exports = {
    monorepo: {
        needMonorepo: '<Boolean>是否开启monorepo',
        name: '<String>开启monorepo需要填写！！相反直接跳过即可'
    },
    git: {
        branch: '<String>可用于release的git分支，一般是main或master',
        email: '<String>release人email',
        name: '<String>release人昵称'
    },
}