const fs = require('fs')
const fsAsync = fs.promises

async function pathExists (path) {
  try {
    await fsAsync.access(path)
    return true
  } catch (error) {
    return false
  }
}

module.exports = pathExists
