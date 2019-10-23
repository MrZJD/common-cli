import { Component } from 'react'

export default class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      txt: 'hello common-cli in react'
    }
  }

  render () {
    return <div className="logo">{ this.state.txt }</div>
  }
}
