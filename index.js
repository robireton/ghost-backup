#!/usr/bin/env node
'use strict'
const path = require('path')
const fs = require('fs-extra')
const mysqldump = require('mysqldump')
const tar = require('tar')
const tmp = require('tmp')

// provide a title to the process
process.title = 'ghost-backup'

const argv = process.argv.slice(2)

if (argv.length === 0) {
  console.error('Run `ghost-backup help` for usage')
  process.exit(1)
}

const instancePath = path.resolve(argv.shift())
console.log(`looking for Ghost install at ${instancePath}`)
const ghostCLI = fs.readJsonSync(path.resolve(instancePath, './.ghost-cli'))
const configPath = path.resolve(instancePath, `./config.${ghostCLI.running}.json`)
const config = fs.readJsonSync(configPath)
const dataPath = path.resolve(config.paths.contentPath, './data')

console.log(`using Ghost config at ${configPath}`)

switch (config.database.client) {
  case 'sqlite3':
    console.log(`sqlite3 database at ${config.database.connection.filename}`)
    if (config.database.connection.filename.startsWith(instancePath)) {
      console.log('database will be backed up at its live location')
    } else {
    // Copy database file into instancePath for backup.
      fs.ensureDirSync(dataPath)
      const destination = path.resolve(dataPath, 'ghost-backup.db')
      fs.copySync(config.database.connection.filename, destination)
      console.log(`Copied ${config.database.connection.filename} to ${destination} for backup`)
    }
    break

  case 'mysql':
    console.log('mysql database…')
    fs.ensureDirSync(dataPath)
    const destination = path.resolve(dataPath, './ghost-backup.sql')
    mysqldump({ connection: config.database.connection, dumpToFile: destination })
    console.log(`dumped ${config.database.connection.database}@${config.database.connection.host} to ${destination} for backup`)
    break

  default:
    console.error(`I don’t know what to do with database client ${config.database.client}`)
    process.exit(1)
}

tmp.setGracefulCleanup()
const tarball = tmp.tmpNameSync({ prefix: 'ghost-backup_', postfix: '.tgz' })
console.log(`backing up ${path.basename(instancePath)} to ${tarball} from ${path.dirname(instancePath)}`)
tar.c({
  sync: true,
  cwd: path.dirname(instancePath),
  gzip: true,
  file: tarball
},
[path.basename(instancePath)])

fs.moveSync(tarball, path.resolve(argv.shift() || process.cwd(), 'ghost-backup.tgz'), { overwrite: true })
