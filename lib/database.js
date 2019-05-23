'use strict'

const path = require('path')
const fs = require('fs-extra')
const mysqldump = require('mysqldump')

module.exports = async function (config) {
  switch (config.ghost.database.client) {
    case 'sqlite3':
      console.log(`sqlite3 database at ${config.ghost.database.connection.filename}`)
      if (config.ghost.database.connection.filename.startsWith(config.paths.base)) {
        console.log('database will be backed up at its live location')
      } else {
      // Copy database file into instancePath for backup.
        fs.ensureDirSync(config.paths.data)
        const destination = path.resolve(config.paths.data, 'ghost-backup.db')
        fs.copySync(config.ghost.database.connection.filename, destination)
        console.log(`Copied ${config.ghost.database.connection.filename} to ${destination} for backup`)
      }
      break

    case 'mysql':
      console.log('mysql database…')
      fs.ensureDirSync(config.paths.data)
      const destination = path.resolve(config.paths.data, './ghost-backup.sql')
      await mysqldump({ connection: config.ghost.database.connection, dumpToFile: destination })
      console.log(`dumped ${config.ghost.database.connection.database}@${config.ghost.database.connection.host} to ${destination} for backup`)
      break

    default:
      throw new Error(`I don’t know what to do with database client ${config.ghost.database.client}`)
  }
}
