'use strict'

const path = require('path')
const fs = require('fs-extra')

module.exports = function (tarball, destination) {
  fs.moveSync(tarball, path.resolve(destination, 'ghost-backup.tgz'), { overwrite: true })
}
