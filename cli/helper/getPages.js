
module.exports = function getPages () {
  const cwd = require('process').cwd()
  const { resolve, basename } = require('path')
  const glob = require('glob')

  return glob.sync(resolve(cwd, 'src/pages') + '/*/')
    .reduce((pagesMap, pagePath) => {
      const pagename = basename(pagePath)
      pagesMap[pagename] = resolve(pagePath, `${pagename}.js`)
      return pagesMap
    }, {})
}
