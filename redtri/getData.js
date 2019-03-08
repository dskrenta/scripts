'use strict';

const fs = require('fs');
const { promisify } = require('util');
const puppeteer = require('puppeteer');

const EVENTS_DATA_FILE_PATH = './data/';

const writeFileAsync = promisify(fs.writeFile);

function wait(mills) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, mills)
  });
}

/*
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
*/

async function main() {
  try {
    await grabRequest(`http://redtri.com/events/san-francisco`);
  }
  catch (error) {
    console.error(error);
  }
}

main();

async function grabRequest(url) {
  try {
    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();

    let count = 1;

    page.on('response', async (res) => {
      try {
        const url = await res.url();
        if (url.startsWith('https://40b2x68xjr-dsn.algolia.net/1/indexes/production-calendar-events/query')) {
          const json = await res.text();
          // console.log(json);
          console.log(`${EVENTS_DATA_FILE_PATH}count-${count}.json`);
          await writeFileAsync(`${EVENTS_DATA_FILE_PATH}count-${count}.json`, json);
          count++;
        }
      }
      catch (error) {
        console.error(error);
      }
    });

    const status = await page.goto(url, {
      waitUntil: ['domcontentloaded', 'load', 'networkidle0']
    });

    if (!status.ok) {
      console.error(`Cannot open ${url}`);
      throw new Error();
    }

    await page.close();
    await browser.close();
  }
  catch (error) {
    console.error(error);
  }
}
