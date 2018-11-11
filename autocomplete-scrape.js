'use strict';

const fs = require('fs');
const crypto = require('crypto');
const NodePoolScraper = require('node-pool-scraper');

const scraper = new NodePoolScraper({
  max: 4,
  min: 2,
  idleTimeoutMillis: 100000,
  headless: true,
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

const chars = [
  'a', 'b', 'c', 'd', 'e', 
  'f', 'g', 'h', 'i', 'j', 
  'k', 'l', 'm', 'n', 'o', 
  'p', 'q', 'r', 's', 't', 
  'u', 'v', 'w', 'x', 'y', 
  'z', '0', '1', '2', '3', 
  '4', '5', '6', '7', '8', 
  '9', '#', '_', '.', '+', 
  '*', '-', '/', '^', '(', 
  ')', '&', '@', '!', '$', 
  '%'
];
const initialSearches = [];

for (let i = 0; i < chars.length; i++) {
  initialSearches.push(`${chars[i]}`);
  for (let j = 0; j < chars.length; j++) {
    initialSearches.push(`${chars[i]}${chars[j]}`);
    for (let x = 0; x < chars.length; x++) {
      initialSearches.push(`${chars[i]}${chars[j]}${chars[x]}`);
    }
  }
}

const searches = [];
for (let search of initialSearches) {
  const fileName = crypto.createHash('md5').update(search).digest('hex');
  if (!fs.existsSync(`./autocomplete/${fileName}.json`)) {
    searches.push(search);
  }
}

// console.log(searches);

let index = 0;

async function grabAutocomplete({ url, browser }) {
  const page = await browser.newPage();
  const status = await page.goto(url, {
    waitUntil: ['domcontentloaded', 'load']
  });

  if (!status.ok) {
    console.error(`Cannot open ${url}`);
    throw new Error();
  }

  // const search = searches.pop();
  const search = searches[index];
  index++;

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

  const fileName = crypto.createHash('md5').update(search).digest('hex');
  await writeFilePromise(`./autocomplete/${fileName}.json`, JSON.stringify(res));

  console.log(`Remaining searches: ${searches.length - index}, Visited searches: ${index}, Current search: ${search}`);

  await page.close();

  scraper.addTarget({
    url: 'https://google.com',
    func: grabAutocomplete
  });
}

scraper.addTarget({
  url: 'https://google.com',
  func: grabAutocomplete
});

