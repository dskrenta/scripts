'use strict';

const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

async function main() {
  try {
    const file = await readFileAsync('ot_scan.jsonl', 'utf-8');
    // const rids = file.trim().split('\n').map(r => r.match(/"rid":"(\d+)"/)[1]);
    const urls = file.trim().split('\n').map(r => r.match(/"url":"(.*?)"/)[1]);
    console.log(urls);
    await writeFileAsync('./ot_urls.json', JSON.stringify(urls));
  }
  catch (error) {
    console.error(error);
  }
}

main();
