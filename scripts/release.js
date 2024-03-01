const path = require('path')
const exec = require('exec-sh')
const fs = require('fs')

async function execWrapper(pathBase) {
  try {
    await exec.promise(`node ${path.resolve(__dirname, pathBase)}`)
  } catch (_) {
    console.log('🙅：执行 ' + pathBase + ' release错误')
    process.exit(1)
  }
}

// 预检测
function checker() {
  return execWrapper('./checker.js')
}

// release信息
function gitHelper() {
  return execWrapper('./gitHelper.js')
}

// changelog生成器
function logGenerator() {
  return execWrapper('./changelog.js')
}

// 更新版本信息
function updateVersion() {
  return execWrapper('./updateVersion.js')
}

// 发包
// function publisher() {
//     echo "do some npm package things\n"
// }

// # 主逻辑
async function main() {
    console.log("release前预检～\n")
    await checker()

    // 创建临时文件
    fs.writeFileSync(path.resolve(__dirname, './temp.json'), "{}")

    console.log("1️⃣. 更新版本信息.....\n")
    await updateVersion()

    console.log("2️⃣. 生成changelog.....\n")
    await logGenerator()

    console.log("3️⃣. git actions\n")
    await gitHelper()

    // echo "x4. npm publish\n"
    // publisher

    console.log("✅：release success🏅！！")

    // 删除临时文件
    fs.unlinkSync(path.resolve(__dirname, './temp.json'))
}

main()
