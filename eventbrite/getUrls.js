'use strict';

const fs = require('fs');
const { promisify } = require('util');
const NodePoolScraper = require('node-pool-scraper');

const DATA_FILE_PATH = './data/eventbrite-urls.txt';

const appendFileAsync = promisify(fs.appendFile);

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

const locales = [
  'co--boulder',
  'ca--san-francisco',
  'ny--new-york',
  'ca--los-angeles',
  'dc--washington',
  'ga-atlanta',
  'il-chicago',
  'ma-boston',
  'pa--philadelphia',
  'fl--miami'
];

const urls = [];

for (let locale of locales) {
  urls.push({
    url: `https://www.eventbrite.com/d/${locale}/all-events/?page=1`,
    locale: locale
  })
} 

async function grabRequest({ url, browser }) {
  try {
    console.log(`Url: ${url.url}, Locale: ${url.locale}`);

    const page = await browser.newPage();
    const status = await page.goto(url.url, {
      waitUntil: ['domcontentloaded', 'load']
    });

    if (!status.ok) {
      console.error(`Cannot open ${url.url}`);
      throw new Error();
    }

    const maxPage = await page.evaluate(() => {
      return parseInt(document.querySelector('.undefined.paginator__link.eds-l-pad-top-2.eds-text-weight--heavy > a').textContent);
    });

    if (maxPage > 1) {
      for (let i = 2; i <= maxPage; i++) {
        urls.push({
          url: `https://www.eventbrite.com/d/${url.locale}/all-events/?page=${i}`,
          locale: url.locale
        });
      }
    }

    const parsedUrls = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.eds-media-card-content__action-link')).map(node => node.getAttribute('href'));
    })

    const trueUrls = new Set(parsedUrls);

    for (let parsedUrl of Array.from(trueUrls)) {
      await appendFileAsync(DATA_FILE_PATH, `${parsedUrl}\n`);
    }

    await page.close();
  }
  catch (error) {
    console.error(error);
  }
  finally {
    await wait(2000);

    scraper.addTarget({
      url: urls.pop(),
      func: grabRequest
    });
  } 
}

scraper.addTarget({
  url: urls.pop(),
  func: grabRequest
});
