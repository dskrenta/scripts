'use strict';

const fs = require('graceful-fs');
const { promisify } = require('util');
const NodePoolScraper = require('node-pool-scraper');

const PARSED_EVENTS_DATA_DIR_PATH = './data/parsedEvents/';
const FINAL_EVENTS_DIR = './data/finalEvents/';

const readDirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

function wait(mills) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, mills)
  });
}

function defer() {
  let res, rej;

  const promise = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });

  promise.resolve = res;
  promise.reject = rej;

  return promise;
}

const scraper = new NodePoolScraper({
  max: 1,
  min: 1,
  idleTimeoutMillis: 100000,
  timeout: 2000,
  headless: true,
  ignoreHTTPSErrors: true
});

async function grabRequest({ url, browser, eventDescriptionPromise, hostDescriptionPromise }) {
  try {
    console.log(`Url: ${url.url}, Type: ${url.type}`);

    const page = await browser.newPage();
    const status = await page.goto(url.url, {
      waitUntil: ['domcontentloaded', 'load']
    });

    if (!status.ok) {
      console.error(`Cannot open ${url.url}`);
      throw new Error();
    }

    let description = null;

    if (url.type === 'event') {
      description = await page.evaluate(() => {
        const selector = document.querySelector('.panel_section');
        if (selector) {
          return selector.textContent.trim().replace(/\r?\n|\r/g, '');
        }
      });
      eventDescriptionPromise.resolve(description);
    }
    else {
      description = await page.evaluate(() => {
        const selector = document.querySelector('.js-long-text.organizer-description');
        if (selector) {
          return selector.textContent.trim().replace(/\r?\n|\r/g, '');
        }
      });
      hostDescriptionPromise.resolve(description);
    }

    await page.close();
  }
  catch (error) {
    console.error(error);
  }
}

async function main() {
  try {
    const files = await readDirAsync(PARSED_EVENTS_DATA_DIR_PATH);
    for (let file of files) {
      const fileObj = await readFileAsync(`${PARSED_EVENTS_DATA_DIR_PATH}${file}`, 'utf-8');
      const objs = JSON.parse(fileObj);
      const newEvents = [];
      for (let event of objs) {
        const eventDescriptionPromise = defer();
        const hostDescriptionPromise = defer();

        console.log(`File: ${file}, Event id: ${event.id}, Host id: ${event.host.id}`);

        scraper.addTarget({
          url: {
            url: `https://www.eventbrite.com/e/${event.id}`,
            type: 'event'
          },
          eventDescriptionPromise,
          func: grabRequest
        });

        scraper.addTarget({
          url: {
            url: `https://www.eventbrite.com/o/${event.host.id}`,
            type: 'host'
          },
          hostDescriptionPromise,
          func: grabRequest
        });

        const eventDescription = await eventDescriptionPromise; 
        const hostDescription = await hostDescriptionPromise;

        event.description = eventDescription;
        event.host.bio = hostDescription;

        newEvents.push(event);

        await wait(1000);
      }
      await writeFileAsync(`${FINAL_EVENTS_DIR}${file}`, JSON.stringify(newEvents));
    }
  }
  catch (error) {
    console.error(error);
  }
}

main();