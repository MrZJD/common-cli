const glob = require('glob')
const path = require('path')
const resolve = (cpath) => {
  return path.resolve(__dirname, cpath)
}

/* 定义 PUBLIC_STATIC_PATH - 静态文件的输出地址 */
const { PUBLIC_STATIC_PATH } = require('./config')

const entry = glob.sync(resolve('../src/lib') + '/*.js').reduce((entryMap, libf) => {
  entryMap[path.basename(libf, '.js')] = libf
  return entryMap
}, {})

if (process.env.NODE_ENV === 'production') {
  const fse = require('fs-extra')
  fse.emptyDirSync(resolve('../dist/static/lib'))
}

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: entry,
  output: {
    path: resolve('../dist/static'),
    filename: 'lib/[name].js',
    publicPath: PUBLIC_STATIC_PATH,
    library: 'lib',
    libraryTarget: 'umd'
  }
}
