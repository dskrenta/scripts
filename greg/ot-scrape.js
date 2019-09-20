'use strict';

const fs = require('fs');
const { promisify, inspect } = require('util');
const NodePoolScraper = require('node-pool-scraper');

const DATA_FILE_PATH = './ot_scrape.jsonl';

const readFileAsync = promisify(fs.readFile);
const appendFileAsync = promisify(fs.appendFile);

const ridsFileContent = fs.readFileSync('./rids.json', 'utf-8');
const urlsFileContent = fs.readFileSync('./ot_urls.json', 'utf-8');
const rids = JSON.parse(ridsFileContent);
const urls = JSON.parse(urlsFileContent);

function wait(mills) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, mills)
  });
}

function generateOutput({
  data = null,
  rid,
  url
}) {
  return {
    type: 'ot_poll',
    request: {
      covers: 2,
      dateTime: new Date(),
      isRedesign: true
    },
    rid,
    url: `https://www.opentable.com/restaurant/profile/${rid}/search`,
    r_url: url,
    response: data,
    created_at: new Date(),
    updated_at: new Date()
  };
}

const scraper = new NodePoolScraper({
  max: 1,
  min: 1,
  idleTimeoutMillis: 100000,
  headless: true,
  ignoreHTTPSErrors: true
});

let count = 0;

async function grabRequest({ url, browser }) {
  const rid = rids.pop();
  count++;

  try {
    console.log(`Current rid: ${rid}, current rid: ${count}, remaning rids: ${rids.length}, url: ${url}`);

    const page = await browser.newPage();
    const status = await page.goto(url, {
      waitUntil: ['domcontentloaded', 'load']
    });

    if (!status.ok) {
      console.error(`Cannot open ${url}`);
      throw new Error();
    }

    page.on('response', async (res) => {
      try {
        const url = await res.url();
        if (url === `https://www.opentable.com/restaurant/profile/${rid}/search`) {
          const json = await res.json();
          const output = generateOutput({ url, rid, data: json });
          console.log(output);
          await appendFileAsync(DATA_FILE_PATH, `${JSON.stringify(output)}\n`);
        }
      }
      catch (error) {
        console.error(error);
      }
    });

    await page.click('.b3cf2c43.faaffad1.a8e8f9b4._06bf3736')

    await page.waitFor(5000);

    await page.close();
  }
  catch (error) {
    // console.error(error);
    const output = generateOutput({ url, rid });
    console.log(output);
    await appendFileAsync(DATA_FILE_PATH, `${JSON.stringify(output)}\n`);
  }
  finally {
    await wait(2000);

    if (rids.length > 0) {
      scraper.addTarget({
        url: urls.pop(),
        func: grabRequest
      });
    }
  }
}

scraper.addTarget({
  url: urls.pop(),
  func: grabRequest
});
