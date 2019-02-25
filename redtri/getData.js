'use strict';

const fs = require('fs');
const { promisify } = require('util');
const NodePoolScraper = require('node-pool-scraper');

const EVENTS_DATA_FILE_PATH = './data/events/';

const writeFileAsync = promisify(fs.writeFile);

function wait(mills) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, mills)
  });
}

const scraper = new NodePoolScraper({
  max: 1,
  min: 1,
  idleTimeoutMillis: 100000,
  headless: true,
  ignoreHTTPSErrors: true
});

const urls = [
  'http://redtri.com/events/denver'
];

async function main() {
  try {
    for (let url of urls) {
      scraper.addTarget({
        url,
        func: grabRequest
      });
    }
  }
  catch (error) {
    console.error(error);
  }
}

main();

async function grabRequest({ url, browser }) {
  try {
    console.log(`Url: ${url}`);

    const page = await browser.newPage();
    const status = await page.goto(url, {
      waitUntil: ['domcontentloaded', 'load']
    });

    if (!status.ok) {
      console.error(`Cannot open ${url}`);
      throw new Error();
    }

    const id = url.match(/([0-9]*)\?aff=ebdssbdestsearch$/)[1];

    page.on('response', async (res) => {
      try {
        const url = await res.url();
        if (url === `https://www.eventbrite.com/ajax/event/${id}/related?aff=erelliv`) {
          const json = await res.text();
          await writeFileAsync(`${EVENTS_DATA_FILE_PATH}${id}.json`, json);
        }
      }
      catch (error) {
        console.error(error);
      }
    });

    await page.waitFor(1500);

    await page.close();
  }
  catch (error) {
    console.error(error);
  }
}

/*
scraper.addTarget({
  url: urls.pop(),
  func: grabRequest
});
*/
