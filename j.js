'use strict';

const { promisify } = require('util');
const crypto = require('crypto');

const fs = require('graceful-fs');
// const redis = require('ioredis');

const AUTOCOMPLETE_DATA_DIR = `${__dirname}/autocomplete`;

const readDirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);

async function main() {
  try {
    const files = await readDirAsync(AUTOCOMPLETE_DATA_DIR);
    const fileContentsPromises = files.map(fileName => readFileAsync(`${AUTOCOMPLETE_DATA_DIR}/${fileName}`, 'utf8'));
    const fileContents = await Promise.all(fileContentsPromises);
    for (let content of fileContents) {
      const values = JSON.parse(content);
      const possibleSearch = content[0][0];
      console.table({possibleSearch, values});
    }
  }
  catch (error) {
    console.error(error);
  }
}

main();
