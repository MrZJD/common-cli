const HTMLWebpackPlugin = require('html-webpack-plugin')
const VuePlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const { resolve, dirname } = require('path')
const { existsSync } = require('fs')

const dirnameRzv = (path) => {
  return resolve(__dirname, path)
}

if (process.env.NODE_ENV === 'production') {
  const fse = require('fs-extra')
  fse.emptyDirSync(resolve('../dist/html/pages'))
  fse.emptyDirSync(resolve('../dist/static/js'))
  fse.emptyDirSync(resolve('../dist/static/style'))
}

/* 项目打包入口 Webapck Entry */
const ENTRY = require('./helper/getPages')()

/* 定义 PUBLIC_STATIC_PATH - 静态文件的输出地址 */
const { PUBLIC_STATIC_PATH } = require('./config')

/* 页面lib依赖配置 Webpack externals */
const getWebpackExternals = () => {
  const cliConfig = dirnameRzv('../src/cli.config.js')
  if (!existsSync(cliConfig)) {
    console.log('!!! 无外部lib配置项')
    return {}
  }
  const libConfig = require(dirnameRzv(cliConfig)).lib || []

  return Object.keys(ENTRY)
    .map((pkey) => {
      const pdir = dirname(ENTRY[pkey])
      const pconfig = existsSync(resolve(pdir, 'config.js')) ? require(resolve(pdir, 'config.js')) : {}

      return pconfig.lib || []
    })
    .reduce((exterMap, lib) => {
      lib.forEach((libChunk) => {
        if (exterMap.indexOf(libChunk) === -1) {
          exterMap.push(libChunk)
        }
      })
      return exterMap
    }, [])
    .reduce((externals, libChunk) => {
      const chunks = libConfig.find(chunk => chunk.name === libChunk)
      if (!chunks) {
        console.log(`Warning: ${libChunk} can't find`)
      }
      chunks.chunks.forEach((chunkExport) => {
        if (externals[chunkExport]) return

        externals[chunkExport] = ['lib', 'default', chunkExport]
      })
      return externals
    }, {})
}

/* html external scripts */
const gtExternalScripts = (scripts) => {
  return scripts.map((src) => `<script type="text/javascript" src="${PUBLIC_STATIC_PATH}/lib/${src}"></script>`).join('')
}

/* HTMLWebpackPlugin Generater */
const HTML_PLUGINS = Object.keys(ENTRY).map((pkey) => {
  const pdir = dirname(ENTRY[pkey])
  const pconfig = existsSync(resolve(pdir, 'config.js')) ? require(resolve(pdir, 'config.js')) : {}
  const poption = pconfig.html || {}

  poption.chunks = [pkey]
  poption.filename = `../html/pages/${pkey}.html`
  poption.template = existsSync(resolve(pdir, 'layout.html')) ? `src/pages/${pkey}/layout.html` : 'src/pages/layout.html'
  poption.externals = gtExternalScripts(pconfig.lib || [])

  return new HTMLWebpackPlugin(poption)
})

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: ENTRY,
  output: {
    path: dirnameRzv('../dist/static'),
    filename: 'js/[name].js?v=[hash:8]',
    publicPath: PUBLIC_STATIC_PATH
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        // 单独提取css文件
        styles: {
          name: 'style',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    },
    minimizer: process.env.NODE_ENV === 'production' ? [
      new TerserJSPlugin({}),
      new OptimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
          safe: true,
          autoprefixer: { disable: true },
          discardComments: {
            removeAll: true
          }
        },
        canPrint: true
      })
    ] : []
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader',
      exclude: file => (
        /node_modules/.test(file) &&
          !/\.vue\.js/.test(file)
      )
    },
    {
      enforce: 'pre',
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader'
    },
    {
      test: /\.js$/,
      loader: 'babel-loader'
    },
    {
      test: /\.(le|c)ss$/,
      use: [
        'vue-style-loader',
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: [
              require('autoprefixer')()
            ]
          }
        },
        'less-loader'
      ]
    },
    {
      test: /\.(png|jpe?g|gif)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '/images/[name]/[name].[ext]?v=[hash:8]'
        }
      }]
    }
    ]
  },
  externals: getWebpackExternals(),
  plugins: [
    new VuePlugin(),
    new MiniCssExtractPlugin({
      filename: 'style/[name].css?v=[hash:8]',
      chunkFilename: '[name].css'
    })
  ].concat(HTML_PLUGINS)
}
