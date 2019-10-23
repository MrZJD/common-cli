import attachFastClick from 'fastclick'

attachFastClick(document.body)

window.React = require('react')

export default {
  react: window.React,
  'react-dom': require('react-dom')
}
