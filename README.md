# common-cli

通用脚手架，复用多lib

## Usage 使用

`src/cli.config.js` cli配置

```js
// cli 配置
module.exports = {
  /* 依赖库 拆分 */
  lib: [
    {
      name: 'in-vue.js',
      chunks: ['vue', 'axios']
    },
    {
      name: 'in-vue-mobile.js',
      chunks: ['vue', 'axios', 'fastclick']
    },
    {
      name: 'in-react.js',
      chunks: ['react', 'react-dom', 'axios']
    },
    {
      name: 'in-react-mobile.js',
      chunks: ['react', 'react-dom', 'fastclick']
    }
  ]
}
```

> 依赖需要先行安装npm包


`src/pages` 目录下对应多页结构

_src/pages/index/config.js_

```json
{
  /* 页面基础库, 可配置第三方url */
  "lib": ["in-vue.js"],
  "html": {
    "title": "主页"
  }
}
```

_src/pages/{pagename}_ 下可自定义 layout.html. 但是需要手动引入 `<%= htmlWebpackPlugin.options.externals %>`

## 开始使用

```bash
# 开发
npm run lib:dev # 构建lib依赖

npm run dev # pages dev

# 发布
npm run lib:build # 构建prod lib

npm run build # pages build

# 包分析
npm run lib:prof
npm run lib:prod_open
```

** master src pages 下为示例 **
