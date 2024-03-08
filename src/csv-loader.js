const path = require('path')
const fs = require('fs')

module.exports = function (source) {
  const filename = path.basename(this.resourcePath)
  const assetInfo = {
    sourceFilename: path.relative(this.rootContext, this.resourcePath),
  }
  this.emitFile(filename, source, null, assetInfo)
  const fileContent = fs.readFileSync(this.resourcePath, 'utf8')
  const lines = fileContent.split('\n')
  const header = lines[0].split(';')
  const body = lines.slice(1).map(line => line.split(';'))



  return `
import React from 'react'

export default function CSVTable(props) {
  return <>
    <h1>${filename}</h1>
    <table>
      <thead>
        <tr>
          ${header.map(h => `<th>${h}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${body.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>
  </>
}
  `
}

// Mark the loader as raw so that the emitted csv binary
// does not get processed in any way.
module.exports.raw = true
