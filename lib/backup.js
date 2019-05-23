'use strict'

const config = require('./config')
const database = require('./database')
const bundle = require('./bundle')
const emplace = require('./emplace')

module.exports = async function (source, destination) {
  const ghostConfig = config(source, destination)
  await database(ghostConfig)
  const tarball = bundle(ghostConfig.paths.base)
  emplace(tarball, ghostConfig.paths.dest)
}
