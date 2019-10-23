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
