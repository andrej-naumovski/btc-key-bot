import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

export default class App extends React.Component {
  render () {
    return (
      <Router>
        <div>
          <h1>Hello world!</h1>
        </div>
      </Router>
    )
  }
}
