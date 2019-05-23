'use strict'

const path = require('path')
const tar = require('tar')
const tmp = require('tmp')

module.exports = function(basePath) {
  const tarball = tmp.tmpNameSync({ prefix: 'ghost-backup_', postfix: '.tgz' })
  console.log(`backing up ${basePath} to ${tarball} from ${path.dirname(basePath)}`)
  tar.c({
    sync: true,
    cwd: path.dirname(basePath),
    gzip: true,
    file: tarball
  },
  [path.basename(basePath)])

  return tarball
}
