#!/usr/bin/env node
'use strict'

const backup = require('../lib/backup')
const cli = async function (args) {
  process.title = 'ghost-backup' // provide a title to the process
  try {
    if (args.length === 0) {
      throw new Error('Run `ghost-backup help` for usage')
    }
    await backup(args.shift(), args.shift() || process.cwd())
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

cli(process.argv.slice(2))
