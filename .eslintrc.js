module.exports = {
  extends: [
    "taro/react"
  ],
  rules: {
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    'import/no-commonjs': 'off',
  },
  parserOptions: {
    requireConfigFile: false,
  },
  env: {
      node: true, // 启用目标环境的全局变量
      browser: true,
  },
}
