'use strict';

const fetch = require('node-fetch');
const fs = require('fs');
const { promisify } = require('util');

const DATA_DIR_PATH = './data/';

const writeFileAsync = promisify(fs.writeFile);

const urls = [
  'https://www.bandsintown.com/en/upcomingEvents?page=1&longitude=-122.4183333&latitude=37.7750000'
];

async function main() {
  try {
    let count = 0;
    for (let url of urls) {
      console.log(`Fetching: ${url}`);
      const req = await fetch(url);
      const res = await req.json();
      // console.log(res);
      if (res.urlForNextPageOfEvents) {
        urls.push(res.urlForNextPageOfEvents)
      }
      await writeFileAsync(`${DATA_DIR_PATH}bandsintown_${count}.json`, JSON.stringify(res));
      count++;
      await wait(1000);
    }
  }
  catch (error) {
    console.error(error);
  }
}

main();

function wait(mills) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, mills)
  });
}
