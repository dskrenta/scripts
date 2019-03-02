'use strict';

const fs = require('fs');
const { promisify } = require('util');
const NodePoolScraper = require('node-pool-scraper');

const DATA_FILE = './data/data.json';

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

async function main() {
  try {
    // stuff
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

    const data = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.rhov')).map(node => {
        return [node.children[0].href.replace('www.techmeme.com/goto/', ''), ...Array.from(node.children[0].children).map(node => node.textContent)];
      });
    });

    console.log(data);

    await writeFileAsync(DATA_FILE, JSON.stringify(data));

    await page.close();
  }
  catch (error) {
    console.error(error);
  }
}

scraper.addTarget({
  url: 'https://www.techmeme.com/events',
  func: grabRequest
});
