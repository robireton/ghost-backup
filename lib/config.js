'use strict'

const path = require('path')
const fs = require('fs-extra')

module.exports = function (source, destination) {
  const instancePath = path.resolve(source)
  console.log(`looking for Ghost install at ${instancePath}`)
  const ghostCLI = fs.readJsonSync(path.resolve(instancePath, './.ghost-cli'))
  const configPath = path.resolve(instancePath, `./config.${ghostCLI.running}.json`)
  const config = fs.readJsonSync(configPath)

  console.log(`using Ghost config at ${configPath}`)

  return {
    paths: {
      base: instancePath,
      data: path.resolve(config.paths.contentPath, './data'),
      dest: path.resolve(destination)
    },
    ghost: config,
    ghost_cli: ghostCLI
  }
}
