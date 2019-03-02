'use strict';

const fs = require('fs');
const { promisify } = require('util');
const puppeteer = require('puppeteer');

const TECHMEME_DATA_PATH = './data/data.json';
const UPDATED_TECHMEME_DATA_PATH = './data/events.json';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

function wait(mills) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, mills)
  });
}

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

function parseDatetime(str) {
  const values = str.split('-');
  const components = values[0].split(' ');
  const date = new Date(Date.UTC(2019, months.indexOf(components[0]), components[1]));
  return date.toISOString();
}

async function main() {
  try {
    const updatedEvents = [];
    const data = await readFileAsync(TECHMEME_DATA_PATH, 'utf-8');
    const events = JSON.parse(data);
    for (let event of events) {
      const latLon = await grabRequest(`https://google.com/search?q=${event[3]}+coordinates`);
      const updatedEvent = {
        hostId: '1a7f50efdabd7fcb7f3a08add71b866e',
        title: event[2],
        address: event[3],
        eventTimestampStart: parseDatetime(event[1]),
        location: latLon ? {
          lat: latLon[0],
          lon: latLon[1]
        } : null,
        urls: [
          {
            url: event[0]
          }
        ],
        externalData: {
          source: 'techmeme'
        }
      };
      console.log(updatedEvent);
      updatedEvents.push(updatedEvent);
      await wait(1000);
    }
    await writeFileAsync(UPDATED_TECHMEME_DATA_PATH, JSON.stringify(updatedEvents));
  }
  catch (error) {
    console.error(error);
  }
}

main();

function parseLatLon(data) {
  return data.replace('° N', '').replace('° W', '').split(',').map((str, idx) => idx === 1 ? `-${str.trim()}` : str.trim());
}

async function grabRequest(url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const status = await page.goto(url, {
      waitUntil: ['domcontentloaded', 'load']
    });

    if (!status.ok) {
      console.error(`Cannot open ${url}`);
      throw new Error();
    }

    const data = await page.evaluate(() => {
      return document.querySelector('.Z0LcW').textContent;
    });

    await page.close();
    await browser.close();

    return parseLatLon(data);
  }
  catch (error) {
    console.error(error);
  }
}
