'use strict';

const fs = require('fs');
const readline = require('readline');
const crypto = require('crypto');
const NodePoolScraper = require('node-pool-scraper');

const scraper = new NodePoolScraper({
  max: 1,
  min: 1,
  idleTimeoutMillis: 100000,
  headless: false,
  ignoreHTTPSErrors: true
});

function writeFilePromise(file, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) {
        reject(err);
      }
      else {
        resolve();
      }
    })
  });
}

// const results = [];
const alphas = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 1, 2, 3, 4, 5, 6, 7, 8, 9, '#', '_', '.', '+', '@', '-', '(', ')'];
const searches = [];
for (let i = 0; i < alphas.length; i++) {
  searches.push(`${alphas[i]}`);
  for (let j = 0; j < alphas.length; j++) {
    searches.push(`${alphas[i]}${alphas[j]}`);
    for (let x = 0; x < alphas.length; x++) {
      searches.push(`${alphas[i]}${alphas[j]}${alphas[x]}`);
    }
  }
}

console.log(searches.length);

async function grabAutocomplete({ url, browser }) {
  const page = await browser.newPage();
  const status = await page.goto(url, {
    waitUntil: ['domcontentloaded', 'load']
  });

  if (!status.ok) {
    console.error(`Cannot open ${url}`);
    throw new Error();
  }

  if (searches.length > 0) {
    const search = searches.pop();

    await page.type('.gLFyf.gsfi', search, {
      delay: 100
    });

    await page.waitFor(500);

    const res = await page.evaluate(() => {
      const elements = document.querySelectorAll('div.sbl1 > span');
      if (elements.length > 0) {
        return Array.from(document.querySelectorAll('div.sbl1 > span')).map(node => node.textContent);
      }
      return [];
    });

    // results.push(res);

    const fileName = crypto.createHash('md5').update(search).digest('hex');
    await writeFilePromise(`./autocomplete/${fileName}.json`, JSON.stringify(res));

    console.log(searches.length);

    await page.close();

    scraper.addTarget({
      url: 'https://google.com',
      func: grabAutocomplete
    });
  }
}

scraper.addTarget({
  url: 'https://google.com',
  func: grabAutocomplete
});

