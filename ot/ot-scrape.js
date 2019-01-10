'use strict';

const fs = require('fs');
const { promisify, inspect } = require('util');
const NodePoolScraper = require('node-pool-scraper');

const OT_URL = 'https://www.opentable.com/bru-burger-bar-lexington';

const readFileAsync = promisify(fs.readFile);

/*
const ridsFileContent = fs.readFileSync('./rids.json', 'utf-8');
const rids = JSON.parse(ridsFileContent);
console.log(rids);
*/

const scraper = new NodePoolScraper({
  max: 1,
  min: 1,
  idleTimeoutMillis: 100000,
  headless: false,
  ignoreHTTPSErrors: true
});

async function grabRequest({ url, browser }) {
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
      if (url === 'https://www.opentable.com/restaurant/profile/115402/search') {
        const json = await res.json();
        console.log(inspect(json, false, null));
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

scraper.addTarget({
  url: OT_URL,
  func: grabRequest
});
