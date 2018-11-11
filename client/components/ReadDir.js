import React from 'react'
// const fs = require('fs')
const path = require('path')

const directoryPath = path.join(__dirname);

// const read = () => {
//   fs.readdir(directoryPath, (err, files) => {
//     if (err) {
//       console.error(err)
//     }
//     files.forEach(file => {
//       console.log(file)
//     })
//   })
// }

export default class ReadDir extends React.Component {
  constructor() {
    super()

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
      event.preventDefault()
      read()
  }

  render() {
    return (
      <div>
        <button type="button" onClick={() => this.handleClick}>List all Names</button>
      </div>
    )
  }
}
