'use strict';

const fs = require('fs');
const { promisify, inspect } = require('util');
const puppeteer = require('puppeteer');

const getLatLon = require('../getLatLon');

const DATA_DIR_PATH = './data/';

const writeFileAsync = promisify(fs.writeFile);

const urls = [
  'https://www.songkick.com/metro_areas/26330-us-sf-bay-area',
  'https://www.songkick.com/metro_areas/17835-us-los-angeles',
  'https://www.songkick.com/metro_areas/7644-us-new-york',
  'https://www.songkick.com/metro_areas/12283-us-portland',
  'https://www.songkick.com/metro_areas/1409-us-washington',
  'https://www.songkick.com/metro_areas/5202-us-philadelphia',
  'https://www.songkick.com/metro_areas/2846-us-seattle',
  'https://www.songkick.com/metro_areas/9426-us-chicago',
  'https://www.songkick.com/metro_areas/3733-us-orlando',
  'https://www.songkick.com/metro_areas/22443-us-pittsburgh'
];

async function main() {
  try {
    let count = 0;
    for (let url of urls) {
      const updatedEvents = [];
      const events = await grabRequest(url);
      for (let event of events) {
        const latLon = event.city ? await getLatLon(event.city) : null;
        const updatedEvent = {
          location: latLon,
          ...event
        };
        updatedEvents.push(updatedEvent);
        console.log(updatedEvent);
      }
      await writeFileAsync(`${DATA_DIR_PATH}/songkick_${count}.json`, JSON.stringify(updatedEvents));
      count++;
    }
  }
  catch (error) {
    console.error(error);
  }
}

main();

async function grabRequest(url) {
  try {
    const browser = await puppeteer.launch({
      // headless: false
    });
    const page = await browser.newPage();

    const status = await page.goto(url, {
      waitUntil: ['domcontentloaded', 'load', 'networkidle0']
    });

    if (!status.ok) {
      console.error(`Cannot open ${url}`);
      throw new Error();
    }

    const events = await page.evaluate(() => {
      const titles = Array.from(document.querySelectorAll('.artists.summary')).map(node => node.textContent.trim().replace(/\r?\n|\r/, ''));
      const venueNames = Array.from(document.querySelectorAll('.venue-name')).map(node => node.textContent);
      const eventUrls = Array.from(document.querySelectorAll('.artists.summary > a')).map(node => node.getAttribute('href'));
      const venueUrls = Array.from(document.querySelectorAll('.venue-name > a')).map(node => node.getAttribute('href'));
      const timestamps = Array.from(document.querySelectorAll('.event-listings > li > time')).map(node => node.getAttribute('datetime')).slice(3);
      const locationInformation = Array.from(document.querySelectorAll('.location')).map(node => node.children[1] && node.children[1].textContent.trim()).slice(1);
      const parsedEvents = [];
      let lastTimestamp = null;
      for (let i = 0; i < titles.length; i++) {
        if (timestamps[i]) lastTimestamp = timestamps[i];
        const addressInfo = locationInformation[i] && locationInformation[i].split('\n').map(val => val.trim());
        const parsedUrls = [];
        if (venueUrls[i]) {
          parsedUrls.push({ url: `https://www.songkick.com${venueUrls[i]}` });
        }
        if (eventUrls[i]) {
          parsedUrls.push({ url: `https://www.songkick.com${eventUrls[i]}` });
        }
        const event = {
          title: titles[i] && titles[i].replace(/\s{2,}/, ''),
          venueName: venueNames[i] && venueNames[i].replace('\t', ''),
          eventTimestampStart: timestamps[i] || lastTimestamp,
          address: addressInfo && `${addressInfo[2]} ${addressInfo[0]}`,
          city: addressInfo && addressInfo[0],
          urls: parsedUrls
        };
        parsedEvents.push(event);
      } 

      const nextPage = document.querySelector('.next_page') ? `https://www.songkick.com${document.querySelector('.next_page').getAttribute('href')}` : null;

      return { parsedEvents, nextPage };
    }); 

    // console.log(inspect(events, false, null));
    console.log(events.nextPage);
    events.nextPage && urls.push(events.nextPage);

    await page.close();
    await browser.close();

    return events.parsedEvents;
  }
  catch (error) {
    console.error(error);
  }
}